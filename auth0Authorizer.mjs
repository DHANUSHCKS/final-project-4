import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';



const AUTH0_DOMAIN = 'dev-ci6sb1wwc1mr82g4.us.auth0.com';
const JWKS_URI = `https://${AUTH0_DOMAIN}/.well-known/jwks.json`;


const client = jwksClient({
  jwksUri: JWKS_URI,
  cache: true,
  rateLimit: true
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    if (err) return callback(err);
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

function generatePolicy(principalId, effect, resource, context = {}) {
  const authResponse = {};
  authResponse.principalId = principalId;

  if (effect && resource) {
    const policyDocument = {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource
        }
      ]
    };
    authResponse.policyDocument = policyDocument;
  }

  if (Object.keys(context).length) {
    authResponse.context = context;
  }

  return authResponse;
}

export const handler = async (event) => {
  try {
    const token = getTokenFromHeader(event.headers);
    if (!token) {
      return generatePolicy('unauthorized', 'Deny', event.methodArn);
    }

    
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(
        token,
        getKey,
        {
          algorithms: ['RS256'],
          audience: 'https://ProjectTodo/',
          issuer: `https://${AUTH0_DOMAIN}/`
        },
        (err, payload) => {
          if (err) return reject(err);
          resolve(payload);
        }
      );
    });

    
    const principalId = decoded.sub;

    const context = {
      sub: decoded.sub,
      scope: decoded.scope || '',
      email: decoded.email || ''
    };

    return generatePolicy(principalId, 'Allow', event.methodArn, context);
  } catch (err) {
    console.error('Auth error', err);
    return generatePolicy('unauthorized', 'Deny', event.methodArn);
  }
};

function getTokenFromHeader(headers = {}) {
  const authHeader = headers.Authorization || headers.authorization;
  if (!authHeader) return null;
  const parts = authHeader.split(' ');
  if (parts.length !== 2) return null;
  const scheme = parts[0];
  const token = parts[1];
  if (!/^Bearer$/i.test(scheme)) return null;
  return token;
}
