import { ObjectLiteral } from '@/types/object-literal.interface';

export function safeArray<T = ObjectLiteral>(arr: any, defaultValue = []) {
  if (Array.isArray(arr) && arr.length > 0) {
    return arr as T[];
  }
  return defaultValue as T[];
}

export function safeObject<T = ObjectLiteral>(obj: any, defaultValue = {}) {
  if (!!obj && typeof obj === 'object') {
    return obj as T;
  }
  return defaultValue as T;
}

export function safeString(str: any, defaultValue = '', stringify = false) {
  if (!!str && typeof str === 'string') {
    return str;
  } else if (typeof str === 'number') {
    return String(str);
  } else if (stringify && typeof str === 'object') {
    return JSON.stringify(str);
  }
  return defaultValue;
}

export function getValObject<T>(obj: T, key = '', defaultValue: any = '') {
  if (!!obj && typeof obj === 'object') {
    const splitKey = key.split('.');
    let value: T = obj;
    for (let i = 0; i < splitKey.length; i++) {
      value = safeObject(value)[splitKey[i]];
    }
    return value || defaultValue;
  }
  return defaultValue;
}

export const errorResponse = (err: any): string => {
  let msg = '';

  if (err.response) {
    msg = err.response.status + ' ' + err.response.statusText;
    if (err.response.data?.message) {
      msg = err.response.data?.message;
    } else if (err.response.data?.messages) {
      msg = err.response.data?.messages;
    }
  } else if (err.message) {
    msg = err.message;
  } else if (typeof err === 'string') {
    msg = err;
  } else {
    msg = safeString(err, '', true);
  }
  return msg;
};

export const getTruncatedText = (text = '', maxLength = 30) => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + '…';
};
