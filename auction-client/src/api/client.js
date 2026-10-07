const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';

// Plockar ut ett läsbart felmeddelande ur api:ets svar.
// Api:et skickar { message } för egna fel och ProblemDetails med "errors" vid valideringsfel.
function extractError(body, status) {
  if (body?.message) return body.message;
  if (body?.errors) return Object.values(body.errors).flat().join(' ');
  if (status === 0) return 'Kunde inte nå servern. Kontrollera att api:et är igång.';
  return `Något gick fel (felkod ${status}).`;
}

export async function request(path, { method = 'GET', body } = {}) {
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error(extractError(null, 0));
  }

  if (response.status === 204) return null;

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(extractError(data, response.status));
  }

  return data;
}
