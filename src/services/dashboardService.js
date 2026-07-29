import { supabase } from './supabase';

export const dashboardService = {

  async getTotales() {

    const [
      inmuebles,
      clientes,
      visitas,
      disponibles
    ] = await Promise.all([

      supabase
        .from('inmuebles')
        .select('*', { count: 'exact', head: true }),

      supabase
        .from('clientes')
        .select('*', { count: 'exact', head: true }),

      supabase
        .from('visitas')
        .select('*', { count: 'exact', head: true }),

      supabase
        .from('inmuebles')
        .select('*', { count: 'exact', head: true })
        .eq('estado', 'Disponible')

    ]);

    return {
      inmuebles: inmuebles.count || 0,
      clientes: clientes.count || 0,
      visitas: visitas.count || 0,
      disponibles: disponibles.count || 0
    };
  }

};