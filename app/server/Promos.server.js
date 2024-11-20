import db from '../db.server';

export async function getAllPromos() {
  try {

    const promos = await db.promoo.findMany({
      orderBy: {
        id: 'asc',
      }
    });

    if (promos.length === 0 ){ return []; }

    return promos;

  } catch (error) {
    return error;
  }
}
