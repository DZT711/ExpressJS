# Express `trust proxy` Setting

When running an Express app behind a reverse proxy, some Express APIs may return different values than expected. To address this, the `trust proxy` application setting can be used to expose information provided by the reverse proxy to Express APIs.

The most common issue is that Express APIs exposing the client's IP address may return the internal IP address of the reverse proxy instead.

## Note

When configuring the `trust proxy` setting, it is important to understand the exact setup of the reverse proxy. Since this setting trusts values provided in the request, the configuration in Express must match how the reverse proxy operates.

## Types of `trust proxy` Values

### 1. Boolean

| Value | Description |
|---|---|
| `true` | The client's IP address is understood as the left-most entry in the `X-Forwarded-For` header. |
| `false` | The app is understood to be directly facing the client, and the client's IP address is derived from `req.socket.remoteAddress`. This is the default setting. |

**Warning:** When setting `trust proxy` to `true`, ensure that the last trusted reverse proxy removes or overwrites all of the following HTTP headers:

- `X-Forwarded-For`
- `X-Forwarded-Host`
- `X-Forwarded-Proto`

Otherwise, a client may be able to provide arbitrary values through these headers.

### 2. IP Addresses

An IP address, subnet, or an array of IP addresses and subnets can be specified as trusted reverse proxies.

The following subnet names are predefined:

| Subnet name | IP range |
|---|---|
| `loopback` | `127.0.0.1/8`, `::1/128` |
| `linklocal` | `169.254.0.0/16`, `fe80::/10` |
| `uniquelocal` | `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `fc00::/7` |

You can configure trusted IP addresses in the following ways:

**Specify a single subnet:**

```javascript
app.set('trust proxy', 'loopback');
```

**Specify a subnet and an IP address:**

```javascript
app.set('trust proxy', 'loopback, 123.123.123.123');
```

**Specify multiple subnets as a comma-separated string:**

```javascript
app.set('trust proxy', 'loopback, linklocal, uniquelocal');
```

**Specify multiple subnets as an array:**

```javascript
app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal']);
```

When IP addresses or subnets are specified, Express excludes trusted addresses from the address determination process and identifies the nearest untrusted IP address as the client's IP address.

The process works as follows:

1. Express checks whether `req.socket.remoteAddress` is trusted.
2. If it is trusted, Express checks the addresses in `X-Forwarded-For` from right to left.
3. The first untrusted address is identified as the client's IP address.

### 3. Number

A number specifies the maximum number of hops between the Express application and the client.

- `req.socket.remoteAddress` represents the first hop.
- The remaining hops are determined from the `X-Forwarded-For` header, starting from the right and moving left.
- A value of `0` means there is no reverse proxy, and the client IP address is obtained from `req.socket.remoteAddress`.

**Warning:** When using this setting, ensure that there are no multiple request paths of different lengths leading to the Express application. Otherwise, a client may be fewer hops away than configured and could provide arbitrary IP address values.

### 4. Function

A custom function can be used to determine which IP addresses are trusted.

**JavaScript:**

```javascript
app.set('trust proxy', (ip) => {
  if (ip === '127.0.0.1' || ip === '123.123.123.123') {
    return true; // Trusted IPs
  } else {
    return false;
  }
});
```

**TypeScript:**

```typescript
app.set('trust proxy', (ip) => {
  if (ip === '127.0.0.1' || ip === '123.123.123.123') {
    return true; // Trusted IPs
  } else {
    return false;
  }
});
```

## Effects of Enabling `trust proxy`

Enabling `trust proxy` affects several Express request properties:

| Property | Effect |
|---|---|
| `req.hostname` | Its value is derived from the `X-Forwarded-Host` header, which may be set by the client or the proxy. |
| `req.protocol` | Its value is derived from `X-Forwarded-Proto`, which the reverse proxy may use to indicate `http` or `https`. The value may also be invalid if the header is not properly controlled. |
| `req.ip` | Contains the client's IP address, determined using the socket address and `X-Forwarded-For` header, based on the configured trust settings. |
| `req.ips` | Contains the IP addresses determined from the socket address and `X-Forwarded-For` header, starting from the first untrusted address. |

## Implementation

The `trust proxy` setting is implemented using the `proxy-addr` package.

For more information, refer to the [`proxy-addr` documentation](https://www.npmjs.com/package/proxy-addr).