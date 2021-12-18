import { UUID_PATTERN } from '../constants';

const mapQueryParams = (query: Location['query']) =>
  Object.keys(query)
    .map((k) => `${k}=${query[k]}`)
    .join('&');

interface Location {
  prefix: string;
  path: string[];
  query: Record<string, string>;
}

export function buildCurrentPath({ location }: { location: Location }) {
  const { prefix, path, query } = location;
  const queryParams = Object.keys(query).length > 0 ? `?${mapQueryParams(query)}` : '';
  const url = `/${prefix}/${path.join('/')}${queryParams}`;

  return url;
}

export function replaceUuidWithSlug(url: string, slug: string) {
  if (!slug) {
    return url;
  }

  const [, ...path] = url.split('/');
  if (path[1].match(UUID_PATTERN)) {
    path[1] = slug;
    return `/${path.join('/')}`;
  }

  return url;
}
