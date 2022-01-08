//tiene algunas funciones que ayudan al programa entero
import { TIMEOUT_SEC } from './config.js';
import { state } from './model.js';
// console.log(TIMEOUT_SEC);
//se le pone el timeout para que no corra por siempre
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(
        new Error(`El request tardo demasiado, mas de despues de ${s} segundos`)
      );
    }, s * 1000);
  });
};
//factoriza los 2 codigos de abajo
export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${data.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};

//obtiene el json y data en un solo lugar
/* export const getJson = async function (url) {
  try {
    const fetchPro = fetch(url);
    // const res = await fetch(res)
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    // mandar error
    if (!res.ok) throw new Error(`${data.message} (${data.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};

export const sendJson = async function (url, uploadData) {
  try {
    const fetchPro = fetch(url, {
      method: 'POST',
      //el contenido que se mandará será json
      headers: {
        'Content-Type': 'application/json',
      },
      //como sera json con esto lo hacemos json
      body: JSON.stringify(uploadData),
    });

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    // mandar error
    if (!res.ok) throw new Error(`${data.message} (${data.status})`);
    return data;
  } catch (err) {
    throw err;
  }
}; */

/* agregar propiedades a objetos condicionalmente  
...(recipe.key && { key: recipe.key }),
como un key: recipe.key
truco muy bueno */
