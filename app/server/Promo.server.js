import db from '../db.server';

export async function getPromo(id){
  try {
    const promo = await db.promo.findUnique({
      where: {
        id: id,
      }
    });

    if (!promo) { return null; }

    return promo;
  } catch (error) {
    return error;
  }
}

export async function createPromo(){

}

export async function updatePromo(){

}

export async function deletePromo(){

}
