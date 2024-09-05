import { stringify } from 'query-string';
import { fetchUtils, DataProvider } from 'ra-core';

const addId = (data: any) => {
    return { ...data, id: data.id ?? data.code ?? data.loginid };
}

const id_replacement: Record<string, string> = {
    'client': 'loginid',
    'payment_gateway': 'code',
    'payment_type': 'code',
    'loginid': 'loginid',
    'account_summary': 'client_loginid',
}

const resolveIdParam = (type: string): string => id_replacement[type] ?? 'id';

/**
 * Supabase REST data provider : customised from ra-data-simple-rest
 * mostly for pagination and query params
 */
export default (
    apiUrl: string,
    apikey: string,
    httpClient = fetchUtils.fetchJson,
    countHeader = 'Content-Range',
): DataProvider => ({
    getList: (resource, params) => {
        const { page, perPage } = params.pagination || { page: 1, perPage: 10 };
        const { field, order } = { field: !params.sort || params.sort.field === 'id' ? resolveIdParam(resource) : params.sort?.field , order: params.sort?.order ?? 'ASC' };

        const rangeStart = (page - 1) * perPage;
        const rangeEnd = page * perPage - 1;
        const query = {
            order: `${field}.${order.toLowerCase()}`,
            offset: rangeStart,
            limit: perPage,
            // filter: JSON.stringify(params.filter),
            apikey,
            select: '*',
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;
        const options =
            countHeader === 'Content-Range'
                ? {
                      // Chrome doesn't return `Content-Range` header if no `Range` is provided in the request.
                      headers: new Headers({
                          Range: `${resource}=${rangeStart}-${rangeEnd}`,
                      }),
                      signal: params?.signal,
                  }
                : { signal: params?.signal };

        return httpClient(url, options).then(({ headers, json }) => {
            return {
                data: json.map(addId),
                total:
                    countHeader === 'Content-Range'
                        ? parseInt(
                              headers.get('content-range')!.split('/')[0]?.split('-')[1] ||
                                  '',
                              10
                          )
                        : parseInt(headers.get(countHeader.toLowerCase())!),
            };
        });
    },

    getOne: (resource, params) => 
        httpClient(`${apiUrl}/${resource}?${stringify({[resolveIdParam(resource)]:`eq.${params.id}`, apikey})}`, {
            signal: params?.signal,
        }).then(({ json }) => ({
            data: json[0],
        })),

    getMany: (resource, params) => {
        const query = {
            filter: JSON.stringify({ id: params.ids }),
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;
        return httpClient(url, { signal: params?.signal }).then(({ json }) => ({
            data: json,
        }));
    },

    getManyReference: (resource, params) => {
        const { page, perPage } = params.pagination;
        const { field, order } = { field: !params.sort || params.sort.field === 'id' ? resolveIdParam(resource) : params.sort?.field , order: params.sort?.order ?? 'ASC' }

        const rangeStart = (page - 1) * perPage;
        const rangeEnd = page * perPage - 1;

        const query = {
            order: `${field}.${order.toLowerCase()}`,
            offset: rangeStart,
            limit: perPage,
            select: '*',
            [params.target === 'id' ? resolveIdParam(resource) : params.target]: `eq.${params.id}`,
            // filter: JSON.stringify({
            //     ...params.filter,
            //     [params.target]: params.id,
            // }),
            apikey,
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;
        const options =
            countHeader === 'Content-Range'
                ? {
                      // Chrome doesn't return `Content-Range` header if no `Range` is provided in the request.
                      headers: new Headers({
                          Range: `${resource}=${rangeStart}-${rangeEnd}`,
                      }),
                      signal: params?.signal,
                  }
                : { signal: params?.signal };

        return httpClient(url, options).then(({ headers, json }) => {
            if (!headers.has(countHeader)) {
                throw new Error(
                    `The ${countHeader} header is missing in the HTTP Response. The simple REST data provider expects responses for lists of resources to contain this header with the total number of results to build the pagination. If you are using CORS, did you declare ${countHeader} in the Access-Control-Expose-Headers header?`
                );
            }
            return {
                data: json.map(addId),
                total:
                    countHeader === 'Content-Range'
                        ? parseInt(
                              headers.get('content-range')!.split('/')[0]?.split('-')[1] ||
                                  '',
                              10
                          )
                        : parseInt(headers.get(countHeader.toLowerCase())!),
            };
        });
    },

    update: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: 'PUT',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: json })),

    // simple-rest doesn't handle provide an updateMany route, so we fallback to calling update n times instead
    updateMany: (resource, params) =>
        Promise.all(
            params.ids.map(id =>
                httpClient(`${apiUrl}/${resource}/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify(params.data),
                })
            )
        ).then(responses => ({
            data: responses.map(({ json }) => json.id),
        })),

    create: (resource, params) =>
        httpClient(`${apiUrl}/${resource}`, {
            method: 'POST',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: json })),

    delete: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: 'DELETE',
            headers: new Headers({
                'Content-Type': 'text/plain',
            }),
        }).then(({ json }) => ({ data: json })),

    // simple-rest doesn't handle filters on DELETE route, so we fallback to calling DELETE n times instead
    deleteMany: (resource, params) =>
        Promise.all(
            params.ids.map(id =>
                httpClient(`${apiUrl}/${resource}/${id}`, {
                    method: 'DELETE',
                    headers: new Headers({
                        'Content-Type': 'text/plain',
                    }),
                })
            )
        ).then(responses => ({
            data: responses.map(({ json }) => json.id),
        })),
});
