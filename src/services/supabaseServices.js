import supabase from '../lib/supabase';

// Servicios para la tabla INMUEBLES
export const inmuebleService = {
  // Obtener todos los inmuebles
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('inmuebles')
        .select(`
          *,
          agente:agente_id (
            id,
            nombre,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  },

  // Obtener inmueble por ID
  async getById(id) {
    try {
      const { data, error } = await supabase
        .from('inmuebles')
        .select(`
          *,
          agente:agente_id (
            id,
            nombre,
            email
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  },

  // Obtener inmuebles por agente
  async getByAgente(agente_id) {
    try {
      const { data, error } = await supabase
        .from('inmuebles')
        .select('*')
        .eq('agente_id', agente_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  },

  // Crear inmueble
  async create(inmueble) {
    try {
      const { data, error } = await supabase
        .from('inmuebles')
        .insert([{
          ...inmueble,
          created_at: new Date(),
          updated_at: new Date(),
        }])
        .select();

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  },

  // Actualizar inmueble
  async update(id, updates) {
    try {
      const { data, error } = await supabase
        .from('inmuebles')
        .update({
          ...updates,
          updated_at: new Date(),
        })
        .eq('id', id)
        .select();

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  },

  // Eliminar inmueble
  async delete(id) {
    try {
      const { error } = await supabase
        .from('inmuebles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true, error: null };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // Buscar inmuebles con filtros
  async search(filters) {
    try {
      let query = supabase
        .from('inmuebles')
        .select(`
          *,
          agente:agente_id (
            nombre,
            email
          )
        `);

      if (filters.tipo) {
        query = query.eq('tipo', filters.tipo);
      }
      if (filters.ciudad) {
        query = query.ilike('ciudad', `%${filters.ciudad}%`);
      }
      if (filters.minPrice) {
        query = query.gte('precio', filters.minPrice);
      }
      if (filters.maxPrice) {
        query = query.lte('precio', filters.maxPrice);
      }
      if (filters.estado) {
        query = query.eq('estado', filters.estado);
      }
      if (filters.agente_id) {
        query = query.eq('agente_id', filters.agente_id);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  },

  // Obtener estadísticas
  async getStats() {
    try {
      const { data: disponibles, error: err1 } = await supabase
        .from('inmuebles')
        .select('id', { count: 'exact' })
        .eq('estado', 'disponible');

      const { data: vendidos, error: err2 } = await supabase
        .from('inmuebles')
        .select('id', { count: 'exact' })
        .eq('estado', 'vendido');

      const { data: alquilados, error: err3 } = await supabase
        .from('inmuebles')
        .select('id', { count: 'exact' })
        .eq('estado', 'alquilado');

      if (err1 || err2 || err3) throw new Error('Error obteniendo estadísticas');

      return {
        data: {
          disponibles: disponibles?.length || 0,
          vendidos: vendidos?.length || 0,
          alquilados: alquilados?.length || 0,
        },
        error: null,
      };
    } catch (err) {
      return { data: null, error: err.message };
    }
  },
};

// Servicios para la tabla CLIENTES
export const clienteService = {
  // Obtener todos los clientes
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .select(`
          *,
          agente:agente_id (
            nombre,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  },

  // Obtener clientes por agente
  async getByAgente(agente_id) {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('agente_id', agente_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  },

  // Crear cliente
  async create(cliente) {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .insert([{
          ...cliente,
          created_at: new Date(),
          updated_at: new Date(),
        }])
        .select();

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  },

  // Actualizar cliente
  async update(id, updates) {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .update({
          ...updates,
          updated_at: new Date(),
        })
        .eq('id', id)
        .select();

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  },

  // Eliminar cliente
  async delete(id) {
    try {
      const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true, error: null };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },
};

// Servicios para la tabla VISITAS
export const visitaService = {
  // Obtener todas las visitas
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('visitas')
        .select(`
          *,
          inmueble:inmueble_id (
            titulo,
            precio
          ),
          cliente:cliente_id (
            nombre,
            email
          ),
          agente:agente_id (
            nombre
          )
        `)
        .order('fecha', { ascending: true });

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  },

  // Obtener visitas por agente
  async getByAgente(agente_id) {
    try {
      const { data, error } = await supabase
        .from('visitas')
        .select(`
          *,
          inmueble:inmueble_id (
            titulo,
            precio
          ),
          cliente:cliente_id (
            nombre,
            email
          )
        `)
        .eq('agente_id', agente_id)
        .order('fecha', { ascending: true });

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  },

  // Crear visita
  async create(visita) {
    try {
      const { data, error } = await supabase
        .from('visitas')
        .insert([{
          ...visita,
          created_at: new Date(),
          updated_at: new Date(),
        }])
        .select();

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  },

  // Actualizar visita
  async update(id, updates) {
    try {
      const { data, error } = await supabase
        .from('visitas')
        .update({
          ...updates,
          updated_at: new Date(),
        })
        .eq('id', id)
        .select();

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  },
};

// Servicios para la tabla VENTAS
export const ventaService = {
  // Obtener todas las ventas
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('ventas')
        .select(`
          *,
          inmueble:inmueble_id (
            titulo,
            precio
          ),
          cliente:cliente_id (
            nombre
          ),
          agente:agente_id (
            nombre
          )
        `)
        .order('fecha_venta', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  },

  // Obtener ventas por agente
  async getByAgente(agente_id) {
    try {
      const { data, error } = await supabase
        .from('ventas')
        .select('*')
        .eq('agente_id', agente_id)
        .order('fecha_venta', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  },

  // Crear venta
  async create(venta) {
    try {
      const { data, error } = await supabase
        .from('ventas')
        .insert([{
          ...venta,
          created_at: new Date(),
          updated_at: new Date(),
        }])
        .select();

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  },

  // Estadísticas de ventas
  async getStats(agente_id = null) {
    try {
      let query = supabase
        .from('ventas')
        .select('precio_venta, comision, fecha_venta');

      if (agente_id) {
        query = query.eq('agente_id', agente_id);
      }

      const { data, error } = await query;

      if (error) throw error;

      const totalVentas = data?.length || 0;
      const totalMonto = data?.reduce((sum, v) => sum + (v.precio_venta || 0), 0) || 0;
      const totalComisiones = data?.reduce((sum, v) => sum + (v.comision || 0), 0) || 0;

      return {
        data: {
          totalVentas,
          totalMonto,
          totalComisiones,
          promedioVenta: totalVentas > 0 ? totalMonto / totalVentas : 0,
        },
        error: null,
      };
    } catch (err) {
      return { data: null, error: err.message };
    }
  },
};
