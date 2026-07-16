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
// src/services/supabaseServices.js - Agregar esto



// ===== SERVICIO DE CLIENTES =====
export const clienteService = {
  // CREATE - Crear nuevo cliente
  async create(datos) {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .insert([datos])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error creando cliente:', error);
      return { data: null, error: error.message };
    }
  },

  // READ - Obtener todos los clientes
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error obteniendo clientes:', error);
      return { data: null, error: error.message };
    }
  },

  // READ - Obtener cliente por ID
  async getById(id) {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error obteniendo cliente:', error);
      return { data: null, error: error.message };
    }
  },

  // READ - Obtener clientes por agente
  async getByAgente(agenteId) {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('agente_id', agenteId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error obteniendo clientes del agente:', error);
      return { data: null, error: error.message };
    }
  },

  // READ - Buscar clientes
  async search(criterios) {
    try {
      let query = supabase.from('clientes').select('*');

      if (criterios.nombre) {
        query = query.ilike('nombre', `%${criterios.nombre}%`);
      }

      if (criterios.email) {
        query = query.ilike('email', `%${criterios.email}%`);
      }

      if (criterios.ciudad) {
        query = query.ilike('ciudad', `%${criterios.ciudad}%`);
      }

      if (criterios.tipo_cliente) {
        query = query.eq('tipo_cliente', criterios.tipo_cliente);
      }

      if (criterios.estado) {
        query = query.eq('estado', criterios.estado);
      }

      if (criterios.presupuesto_min) {
        query = query.gte('presupuesto_max', criterios.presupuesto_min);
      }

      if (criterios.presupuesto_max) {
        query = query.lte('presupuesto_min', criterios.presupuesto_max);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error buscando clientes:', error);
      return { data: null, error: error.message };
    }
  },

  // UPDATE - Actualizar cliente
  async update(id, datos) {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .update({
          ...datos,
          updated_at: new Date(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error actualizando cliente:', error);
      return { data: null, error: error.message };
    }
  },

  // DELETE - Eliminar cliente
  async delete(id) {
    try {
      const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      console.error('Error eliminando cliente:', error);
      return { success: false, error: error.message };
    }
  },

  // STATS - Obtener estadísticas
  async getStats() {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .select('id, tipo_cliente, estado');

      if (error) throw error;

      const stats = {
        total: data.length,
        compradores: data.filter(c => c.tipo_cliente === 'comprador').length,
        vendedores: data.filter(c => c.tipo_cliente === 'vendedor').length,
        arrendatarios: data.filter(c => c.tipo_cliente === 'arrendatario').length,
        activos: data.filter(c => c.estado === 'activo').length,
        inactivos: data.filter(c => c.estado === 'inactivo').length,
      };

      return { data: stats, error: null };
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      return { data: null, error: error.message };
    }
  },
};
