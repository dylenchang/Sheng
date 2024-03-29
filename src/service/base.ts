import { API_PREFIX, IS_CE_EDITION, PUBLIC_API_PREFIX } from "@/config";
import Toast from "@/app/components/base/toast";

const TIME_OUT = 100000;

const ContentType = {
  json: "application/json",
  stream: "text/event-stream",
  form: "application/x-www-form-urlencoded; charset=UTF-8",
  download: "application/octet-stream", // for download
  upload: "multipart/form-data", // for upload
};

const baseOptions = {
  method: "GET",
  mode: "cors",
  credentials: "include", // always send cookies、HTTP Basic authentication.
  headers: new Headers({
    "Content-Type": ContentType.json,
  }),
  redirect: "follow",
};

type ResponseError = {
  code: string;
  message: string;
  status: number;
};

type FetchOptionType = Omit<RequestInit, "body"> & {
  params?: Record<string, any>;
  body?: BodyInit | Record<string, any> | null;
};

type IOtherOptions = {
  form?: boolean;
  isPublicAPI?: boolean;
  bodyStringify?: boolean;
  needAllResponseContent?: boolean;
  deleteContentType?: boolean;
  getAbortController?: (abortController: AbortController) => void;
};

function unicodeToChar(text: string) {
  if (!text) return "";

  return text.replace(/\\u[0-9a-f]{4}/g, (_match, p1) => {
    return String.fromCharCode(parseInt(p1, 16));
  });
}

export function format(text: string) {
  let res = text.trim();
  if (res.startsWith("\n")) res = res.replace("\n", "");

  return res.replaceAll("\n", "<br/>").replaceAll("```", "");
}

const baseFetch = <T>(
  url: string,
  fetchOptions: FetchOptionType,
  {
    isPublicAPI = false,
    bodyStringify = true,
    needAllResponseContent,
    deleteContentType,
    getAbortController,
  }: IOtherOptions
): Promise<T> => {
  const options: typeof baseOptions & FetchOptionType = Object.assign(
    {},
    baseOptions,
    fetchOptions
  );
  if (getAbortController) {
    const abortController = new AbortController();
    getAbortController(abortController);
    options.signal = abortController.signal;
  }
  if (isPublicAPI) {
    const sharedToken = globalThis.location.pathname.split("/").slice(-1)[0];
    const accessToken =
      localStorage.getItem("token") || JSON.stringify({ [sharedToken]: "" });
    let accessTokenJson = { [sharedToken]: "" };
    try {
      accessTokenJson = JSON.parse(accessToken);
    } catch (e) {}
    options.headers.set(
      "Authorization",
      `Bearer ${accessTokenJson[sharedToken]}`
    );
  } else {
    const accessToken = localStorage.getItem("console_token") || "";
    options.headers.set("Authorization", `Bearer ${accessToken}`);
  }

  if (deleteContentType) {
    options.headers.delete("Content-Type");
  } else {
    const contentType = options.headers.get("Content-Type");
    if (!contentType) options.headers.set("Content-Type", ContentType.json);
  }

  const urlPrefix = isPublicAPI ? PUBLIC_API_PREFIX : API_PREFIX;
  let urlWithPrefix = `${urlPrefix}${url.startsWith("/") ? url : `/${url}`}`;

  const { method, params, body } = options;
  // handle query
  if (method === "GET" && params) {
    const paramsArray: string[] = [];
    Object.keys(params).forEach((key) =>
      paramsArray.push(`${key}=${encodeURIComponent(params[key])}`)
    );
    if (urlWithPrefix.search(/\?/) === -1)
      urlWithPrefix += `?${paramsArray.join("&")}`;
    else urlWithPrefix += `&${paramsArray.join("&")}`;

    delete options.params;
  }

  if (body && bodyStringify) options.body = JSON.stringify(body);

  // Handle timeout
  return Promise.race([
    new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error("request timeout"));
      }, TIME_OUT);
    }),
    new Promise((resolve, reject) => {
      globalThis
        .fetch(urlWithPrefix, options as RequestInit)
        .then((res) => {
          const resClone = res.clone();
          // Error handler
          if (!/^(2|3)\d{2}$/.test(String(res.status))) {
            const bodyJson = res.json();
            switch (res.status) {
              case 401: {
                if (isPublicAPI) {
                  return bodyJson.then((data: ResponseError) => {
                    Toast.notify({ type: "error", message: data.message });
                    return Promise.reject(data);
                  });
                }
                const loginUrl = `${globalThis.location.origin}/signin`;
                bodyJson
                  .then((data: ResponseError) => {
                    if (data.code === "init_validate_failed" && IS_CE_EDITION)
                      Toast.notify({
                        type: "error",
                        message: data.message,
                        duration: 4000,
                      });
                    else if (
                      data.code === "not_init_validated" &&
                      IS_CE_EDITION
                    )
                      globalThis.location.href = `${globalThis.location.origin}/init`;
                    else if (data.code === "not_setup" && IS_CE_EDITION)
                      globalThis.location.href = `${globalThis.location.origin}/install`;
                    else if (location.pathname !== "/signin" || !IS_CE_EDITION)
                      globalThis.location.href = loginUrl;
                    else Toast.notify({ type: "error", message: data.message });
                  })
                  .catch(() => {
                    // Handle any other errors
                    globalThis.location.href = loginUrl;
                  });

                break;
              }
              case 403:
                bodyJson.then((data: ResponseError) => {
                  Toast.notify({ type: "error", message: data.message });
                  if (data.code === "already_setup")
                    globalThis.location.href = `${globalThis.location.origin}/signin`;
                });
                break;
              // fall through
              default:
                bodyJson.then((data: ResponseError) => {
                  Toast.notify({ type: "error", message: data.message });
                });
            }
            return Promise.reject(resClone);
          }

          // handle delete api. Delete api not return content.
          if (res.status === 204) {
            resolve({ result: "success" });
            return;
          }

          // return data
          const data: Promise<T> =
            options.headers.get("Content-type") === ContentType.download
              ? res.blob()
              : res.json();

          resolve(needAllResponseContent ? resClone : data);
        })
        .catch((err) => {
          Toast.notify({ type: "error", message: err });
          reject(err);
        });
    }),
  ]) as Promise<T>;
};

export const upload = (
  options: any,
  isPublicAPI?: boolean,
  url?: string
): Promise<any> => {
  const urlPrefix = isPublicAPI ? PUBLIC_API_PREFIX : API_PREFIX;
  let token = "";
  if (isPublicAPI) {
    const sharedToken = globalThis.location.pathname.split("/").slice(-1)[0];
    const accessToken =
      localStorage.getItem("token") || JSON.stringify({ [sharedToken]: "" });
    let accessTokenJson = { [sharedToken]: "" };
    try {
      accessTokenJson = JSON.parse(accessToken);
    } catch (e) {}
    token = accessTokenJson[sharedToken];
  } else {
    const accessToken = localStorage.getItem("console_token") || "";
    token = accessToken;
  }
  const defaultOptions = {
    method: "POST",
    url: url ? `${urlPrefix}${url}` : `${urlPrefix}/files/upload`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {},
  };
  options = {
    ...defaultOptions,
    ...options,
    headers: { ...defaultOptions.headers, ...options.headers },
  };
  return new Promise((resolve, reject) => {
    const xhr = options.xhr;
    xhr.open(options.method, options.url);
    for (const key in options.headers)
      xhr.setRequestHeader(key, options.headers[key]);

    xhr.withCredentials = true;
    xhr.responseType = "json";
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 201) resolve(xhr.response);
        else reject(xhr);
      }
    };
    xhr.upload.onprogress = options.onprogress;
    xhr.send(options.data);
  });
};

// base request
export const request = <T>(
  url: string,
  options = {},
  otherOptions?: IOtherOptions
) => {
  return baseFetch<T>(url, options, otherOptions || {});
};

// request methods
export const get = <T>(
  url: string,
  options = {},
  otherOptions?: IOtherOptions
) => {
  return request<T>(
    url,
    Object.assign({}, options, { method: "GET" }),
    otherOptions
  );
};

// For public API
export const getPublic = <T>(
  url: string,
  options = {},
  otherOptions?: IOtherOptions
) => {
  return get<T>(url, options, { ...otherOptions, isPublicAPI: true });
};

export const post = <T>(
  url: string,
  options = {},
  otherOptions?: IOtherOptions
) => {
  return request<T>(
    url,
    Object.assign({}, options, { method: "POST" }),
    otherOptions
  );
};

export const postPublic = <T>(
  url: string,
  options = {},
  otherOptions?: IOtherOptions
) => {
  return post<T>(url, options, { ...otherOptions, isPublicAPI: true });
};

export const put = <T>(
  url: string,
  options = {},
  otherOptions?: IOtherOptions
) => {
  return request<T>(
    url,
    Object.assign({}, options, { method: "PUT" }),
    otherOptions
  );
};

export const putPublic = <T>(
  url: string,
  options = {},
  otherOptions?: IOtherOptions
) => {
  return put<T>(url, options, { ...otherOptions, isPublicAPI: true });
};

export const del = <T>(
  url: string,
  options = {},
  otherOptions?: IOtherOptions
) => {
  return request<T>(
    url,
    Object.assign({}, options, { method: "DELETE" }),
    otherOptions
  );
};

export const delPublic = <T>(
  url: string,
  options = {},
  otherOptions?: IOtherOptions
) => {
  return del<T>(url, options, { ...otherOptions, isPublicAPI: true });
};

export const patch = <T>(
  url: string,
  options = {},
  otherOptions?: IOtherOptions
) => {
  return request<T>(
    url,
    Object.assign({}, options, { method: "PATCH" }),
    otherOptions
  );
};

export const patchPublic = <T>(
  url: string,
  options = {},
  otherOptions?: IOtherOptions
) => {
  return patch<T>(url, options, { ...otherOptions, isPublicAPI: true });
};
