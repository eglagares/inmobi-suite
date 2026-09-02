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
//Mapa de inmuebles en el dashboard
// Obtener inmuebles para el mapa
async getMapa() {

  try {

    const { data, error } = await supabase
      .from("inmuebles")
      .select("*")
      .not("latitud", "is", null)
      .not("longitud", "is", null);

        if (error) throw error;

        return { data, error: null };

      } catch (error) {

        console.error(error);

        return {
          data: [],
          error: error.message,
        };

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

      console.log("Datos que se envían a Supabase:");
      console.log(updates);
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
// src/services/supabaseServices.js - AGREGAR ESTO
 
// ===== SERVICIO DE VISITAS =====
export const visitaService = {
  // CREATE - Crear nueva visita
  async create(datos) {
    try {
      const { data, error } = await supabase
        .from('visitas')
        .insert([datos])
        .select(`
          *,
          cliente:cliente_id(id, nombre, email, telefono),
          inmueble:inmueble_id(id, titulo, precio, ubicacion, imagenes_urls)
        `)
        .single();
 
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error creando visita:', error);
      console.log("cliente_id:", datos.cliente_id);
      console.log("inmueble_id:", datos.inmueble_id);
      console.log(datos);
      return { data: null, error: error.message };
    }
  },
 
  // READ - Obtener todas las visitas
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('visitas')
        .select(`
          *,
          cliente:cliente_id(id, nombre, email, telefono),
          inmueble:inmueble_id(id, titulo, precio, ubicacion, imagenes_urls)
        `)
        .order('fecha', { ascending: false });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error obteniendo visitas:', error);
      return { data: null, error: error.message };
    }
  },
 
  // READ - Obtener visita por ID
  async getById(id) {
    try {
      const { data, error } = await supabase
        .from('visitas')
        .select(`
          *,
          cliente:cliente_id(id, nombre, email, telefono),
          inmueble:inmueble_id(id, titulo, precio, ubicacion, imagenes_urls)
        `)
        .eq('id', id)
        .single();
 
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error obteniendo visita:', error);
      return { data: null, error: error.message };
    }
  },
 
  // READ - Obtener visitas por cliente
  async getByCliente(clienteId) {
    try {
      const { data, error } = await supabase
        .from('visitas')
        .select(`
          *,
          cliente:cliente_id(id, nombre, email, telefono),
          inmueble:inmueble_id(id, titulo, precio, ubicacion, imagenes_urls)
        `)
        .eq('cliente_id', clienteId)
        .order('fecha', { ascending: false });
 
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error obteniendo visitas del cliente:', error);
      return { data: null, error: error.message };
    }
  },
 
  // READ - Obtener visitas por inmueble
  async getByInmueble(inmuebleId) {
    try {
      const { data, error } = await supabase
        .from('visitas')
        .select(`
          *,
          cliente:cliente_id(id, nombre, email, telefono),
          inmueble:inmueble_id(id, titulo, precio, ubicacion, imagenes_urls)
        `)
        .eq('inmueble_id', inmuebleId)
        .order('fecha', { ascending: false });
 
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error obteniendo visitas del inmueble:', error);
      return { data: null, error: error.message };
    }
  },
 
  // READ - Obtener visitas por agente
  async getByAgente(agenteId) {
    try {
      const { data, error } = await supabase
        .from('visitas')
        .select(`
          *,
          cliente:cliente_id(id, nombre, email, telefono),
          inmueble:inmueble_id(id, titulo, precio, ubicacion, imagenes_urls)
        `)
        .eq('agente_id', agenteId)
        .order('fecha', { ascending: false });
 
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error obteniendo visitas del agente:', error);
      return { data: null, error: error.message };
    }
  },
 
  // READ - Obtener visitas próximas (próximos 7 días)
  async getProximas(agenteId) {
    try {
      const hoy = new Date().toISOString().split('T')[0];
      const en7Dias = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];
 
      const { data, error } = await supabase
        .from('visitas')
        .select(`
          *,
          cliente:cliente_id(id, nombre, email, telefono),
          inmueble:inmueble_id(id, titulo, precio, ubicacion, imagenes_urls)
        `)
        .eq('agente_id', agenteId)
        .gte('fecha', hoy)
        .lte('fecha', en7Dias)
        .eq('estado', 'confirmada')
        .order('fecha', { ascending: true });
 
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error obteniendo próximas visitas:', error);
      return { data: null, error: error.message };
    }
  },
 
  // READ - Buscar visitas
  async search(criterios) {
    try {
      let query = supabase.from('visitas').select(`
        *,
        cliente:cliente_id(id, nombre, email, telefono),
        inmueble:inmueble_id(id, titulo, precio, ubicacion, imagenes_urls)
      `);
 
      if (criterios.cliente_id) {
        query = query.eq('cliente_id', criterios.cliente_id);
      }
 
      if (criterios.inmueble_id) {
        query = query.eq('inmueble_id', criterios.inmueble_id);
      }
 
      if (criterios.estado) {
        query = query.eq('estado', criterios.estado);
      }
 
      if (criterios.fecha) {
        query = query.eq('fecha', criterios.fecha);
      }
 
      if (criterios.agente_id) {
        query = query.eq('agente_id', criterios.agente_id);
      }
 
      const { data, error } = await query.order('fecha', { ascending: false });
 
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error buscando visitas:', error);
      return { data: null, error: error.message };
    }
  },
 
  // UPDATE - Actualizar visita
  async update(id, datos) {
    try {
      const { data, error } = await supabase
        .from('visitas')
        .update({
          ...datos,
          updated_at: new Date(),
        })
        .eq('id', id)
        .select(`
          *,
          cliente:cliente_id(id, nombre, email, telefono),
          inmueble:inmueble_id(id, titulo, precio, ubicacion, imagenes_urls)
        `)
        .single();
 
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error actualizando visita:', error);
      return { data: null, error: error.message };
    }
  },
 
  // DELETE - Eliminar visita
  async delete(id) {
    try {
      const { error } = await supabase
        .from('visitas')
        .delete()
        .eq('id', id);
 
      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      console.error('Error eliminando visita:', error);
      return { success: false, error: error.message };
    }
  },
 
  // STATS - Obtener estadísticas
  async getStats(agenteId) {
    try {
      const { data, error } = await supabase
        .from('visitas')
        .select('id, estado')
        .eq('agente_id', agenteId);
 
      if (error) throw error;
 
      const stats = {
        total: data.length,
        confirmadas: data.filter(v => v.estado === 'confirmada').length,
        realizadas: data.filter(v => v.estado === 'realizada').length,
        canceladas: data.filter(v => v.estado === 'cancelada').length,
      };
 
      return { data: stats, error: null };
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      return { data: null, error: error.message };
    }
  },
};


// ==========================================
// DASHBOARD
// ==========================================

export const dashboardService = {

  async getTotales() {

    try {

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
          .eq('estado', 'disponible')

      ]);

      return {
        data: {
          inmuebles: inmuebles.count || 0,
          clientes: clientes.count || 0,
          visitas: visitas.count || 0,
          disponibles: disponibles.count || 0
        },
        error: null
      };

    } catch (error) {

      console.error('Error obteniendo dashboard:', error);

      return {
        data: null,
        error: error.message
      };

    }

  },
      async getInmueblesRecientes() {

      try {

        const { data, error } = await supabase
          .from('inmuebles')
          .select(`
            id,
            titulo,
            precio,
            estado,
            dormitorios,
            imagenes_urls
          `)
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) throw error;

        return { data, error: null };

      } catch (error) {

        console.error('Error obteniendo inmuebles recientes:', error);

        return { data: null, error: error.message };

      }

    }

};

// Servicios para tabla CONTRATOS - Copiar a supabaseServices.js

// ✅ VERSIÓN SIN ERROR 400
export const contratoService = {
  // Obtener todos los contratos
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('contratos')
        .select('*')  // ← SELECT simple
        .order('created_at', { ascending: false });
 
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (err) {
      console.error('Error getAll:', err);
      return { data: [], error: err.message };
    }
  },
 
  // Obtener contrato por ID
  async getById(id) {
    try {
      const { data, error } = await supabase
        .from('contratos')
        .select('*')  // ← SELECT simple
        .eq('id', id)
        .single();
 
      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      console.error('Error getById:', err);
      return { data: null, error: err.message };
    }
  },
 
  // ✅ ARREGLADO: Obtener contratos por agente (SIN error 400)
  async getByAgente(agente_id) {
    try {
      // SELECT simple - SIN JOINS
      const { data, error } = await supabase
        .from('contratos')
        .select('*')  // ← SELECT simple
        .eq('agente_id', agente_id)
        .order('created_at', { ascending: false });
 
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (err) {
      console.error('Error getByAgente:', err);
      return { data: [], error: err.message };
    }
  },
 
  // Obtener contratos por cliente
  async getByCliente(cliente_id) {
    try {
      const { data, error } = await supabase
        .from('contratos')
        .select('*')
        .eq('cliente_id', cliente_id)
        .order('created_at', { ascending: false });
 
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (err) {
      console.error('Error getByCliente:', err);
      return { data: [], error: err.message };
    }
  },
 
  // Obtener contratos por inmueble
  async getByInmueble(inmueble_id) {
    try {
      const { data, error } = await supabase
        .from('contratos')
        .select('*')
        .eq('inmueble_id', inmueble_id)
        .order('created_at', { ascending: false });
 
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (err) {
      console.error('Error getByInmueble:', err);
      return { data: [], error: err.message };
    }
  },
 
  // Obtener contratos pendientes de firma
  async getPendientesFirma(agente_id) {
    try {
      const { data, error } = await supabase
        .from('contratos')
        .select('*')
        .eq('agente_id', agente_id)
        .eq('estado', 'pendiente_firma')
        .order('created_at', { ascending: true });
 
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (err) {
      console.error('Error getPendientesFirma:', err);
      return { data: [], error: err.message };
    }
  },
 
  // Obtener contratos por estado
  async getByEstado(estado, agente_id = null) {
    try {
      let query = supabase
        .from('contratos')
        .select('*')
        .eq('estado', estado);
 
      if (agente_id) {
        query = query.eq('agente_id', agente_id);
      }
 
      const { data, error } = await query.order('created_at', { ascending: false });
 
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (err) {
      console.error('Error getByEstado:', err);
      return { data: [], error: err.message };
    }
  },
 
  // Crear contrato
  async create(contrato) {
    try {
      if (!contrato.numero_contrato) {
        const timestamp = Date.now();
        contrato.numero_contrato = `CONT-${timestamp}`;
      }
 
      if (!contrato.comision_monto && contrato.comision_porcentaje && contrato.precio_total) {
        contrato.comision_monto = (contrato.precio_total * contrato.comision_porcentaje) / 100;
      }
 
      const { data, error } = await supabase
        .from('contratos')
        .insert([contrato])
        .select();
 
      if (error) throw error;
      return { data: data?.[0] || null, error: null };
    } catch (err) {
      console.error('Error create:', err);
      return { data: null, error: err.message };
    }
  },
 
  // Actualizar contrato
  async update(id, contrato) {
    try {
      if (contrato.comision_porcentaje && contrato.precio_total) {
        contrato.comision_monto = (contrato.precio_total * contrato.comision_porcentaje) / 100;
      }
 
      const { data, error } = await supabase
        .from('contratos')
        .update(contrato)
        .eq('id', id)
        .select();
 
      if (error) throw error;
      return { data: data?.[0] || null, error: null };
    } catch (err) {
      console.error('Error update:', err);
      return { data: null, error: err.message };
    }
  },
 
  // Firmar contrato
  async firmarContrato(id, tipo_firma, fecha_firma = new Date().toISOString().split('T')[0]) {
    try {
      const updateData = {};
 
      if (tipo_firma === 'cliente') {
        updateData.firmado_cliente = true;
        updateData.fecha_firma_cliente = fecha_firma;
      } else if (tipo_firma === 'agente') {
        updateData.firmado_agente = true;
        updateData.fecha_firma_agente = fecha_firma;
      }
 
      const contratoActual = await this.getById(id);
      if (contratoActual.data) {
        const firmadoCliente = updateData.firmado_cliente || contratoActual.data.firmado_cliente;
        const firmadoAgente = updateData.firmado_agente || contratoActual.data.firmado_agente;
 
        if (firmadoCliente && firmadoAgente) {
          updateData.estado = 'firmado';
          updateData.fecha_firma = fecha_firma;
        }
      }
 
      const { data, error } = await supabase
        .from('contratos')
        .update(updateData)
        .eq('id', id)
        .select();
 
      if (error) throw error;
      return { data: data?.[0] || null, error: null };
    } catch (err) {
      console.error('Error firmarContrato:', err);
      return { data: null, error: err.message };
    }
  },
 
  // Cambiar estado
  async cambiarEstado(id, nuevoEstado) {
    try {
      const { data, error } = await supabase
        .from('contratos')
        .update({ estado: nuevoEstado })
        .eq('id', id)
        .select();
 
      if (error) throw error;
      return { data: data?.[0] || null, error: null };
    } catch (err) {
      console.error('Error cambiarEstado:', err);
      return { data: null, error: err.message };
    }
  },
 
  // Subir documento
  async subirDocumento(id, archivo, tipo = 'documento') {
    try {
      const nombreArchivo = `contrato-${id}-${Date.now()}-${archivo.name}`;
      const { data, error } = await supabase.storage
        .from('contratos')
        .upload(nombreArchivo, archivo);
 
      if (error) throw error;
 
      const urlPublica = `${process.env.VITE_SUPABASE_URL}/storage/v1/object/public/contratos/${data.path}`;
 
      if (tipo === 'documento') {
        await this.update(id, { documento_url: urlPublica });
      } else if (tipo === 'pdf') {
        await this.update(id, { documento_pdf_url: urlPublica });
      }
 
      return { data: urlPublica, error: null };
    } catch (err) {
      console.error('Error subirDocumento:', err);
      return { data: null, error: err.message };
    }
  },
 
  // Obtener historial
  async getHistorial(id) {
    try {
      const { data, error } = await supabase
        .from('contratos_historial')
        .select('*')
        .eq('contrato_id', id)
        .order('created_at', { ascending: false });
 
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (err) {
      console.error('Error getHistorial:', err);
      return { data: [], error: err.message };
    }
  },
 
  // Buscar contratos
  async search(termino) {
    try {
      const { data, error } = await supabase
        .from('contratos')
        .select('*')
        .or(`numero_contrato.ilike.%${termino}%,titulo.ilike.%${termino}%`)
        .order('created_at', { ascending: false });
 
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (err) {
      console.error('Error search:', err);
      return { data: [], error: err.message };
    }
  },
 
  // Obtener estadísticas
  async getStats(agente_id = null) {
    try {
      let query = supabase.from('contratos').select('*', { count: 'exact' });
 
      if (agente_id) {
        query = query.eq('agente_id', agente_id);
      }
 
      const { data, count, error } = await query;
 
      if (error) throw error;
 
      const stats = {
        total: count || 0,
        borradores: 0,
        pendientes_firma: 0,
        firmados: 0,
        completados: 0,
        cancelados: 0,
      };
 
      if (data) {
        data.forEach(contrato => {
          const estado = contrato.estado;
          if (stats[`${estado}s`] !== undefined) {
            stats[`${estado}s`]++;
          }
        });
      }
 
      return { data: stats, error: null };
    } catch (err) {
      console.error('Error getStats:', err);
      return { data: null, error: err.message };
    }
  },
 
  // Eliminar contrato
  async delete(id) {
    try {
      const { error } = await supabase
        .from('contratos')
        .delete()
        .eq('id', id);
 
      if (error) throw error;
      return { error: null };
    } catch (err) {
      console.error('Error delete:', err);
      return { error: err.message };
    }
  }
};