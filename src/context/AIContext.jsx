import React, { createContext, useContext, useState } from 'react';

const AIContext = createContext();

export function AIProvider({ children }) {
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('inmobiAIApiKey') || '';
  });

  const [isConfigured, setIsConfigured] = useState(() => {
    return localStorage.getItem('inmobiAIConfigured') === 'true';
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const saveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem('inmobiAIApiKey', key);
    localStorage.setItem('inmobiAIConfigured', 'true');
    setIsConfigured(true);
  };

  const clearApiKey = () => {
    setApiKey('');
    localStorage.removeItem('inmobiAIApiKey');
    localStorage.removeItem('inmobiAIConfigured');
    setIsConfigured(false);
  };

  const callAI = async (messages, model = 'gpt-3.5-turbo') => {
    if (!apiKey) {
      setError('Por favor configura tu API Key de OpenAI');
      return null;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error?.message || 'Error en la API de OpenAI');
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Funciones específicas de IA
  const generateDescription = async (propertyData) => {
    const prompt = `
Genera una descripción profesional y atractiva para un inmueble con estos datos:
- Tipo: ${propertyData.tipo}
- Dormitorios: ${propertyData.bedrooms}
- Baños: ${propertyData.bathrooms}
- Área: ${propertyData.area}
- Ubicación: ${propertyData.location}
- Características: ${propertyData.features || 'No especificadas'}
- Precio: ${propertyData.price}

La descripción debe ser concisa, profesional y persuasiva. Máximo 200 palabras.`;

    return await callAI([
      {
        role: 'system',
        content: 'Eres un especialista en marketing inmobiliario que crea descripciones profesionales y persuasivas de propiedades.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ]);
  };

  const translateDescription = async (text, targetLanguage) => {
    const prompt = `
Traduce el siguiente texto al ${targetLanguage}. Mantén el tono profesional y la estructura del texto original.

Texto original:
${text}

Proporciona solo la traducción sin explicaciones adicionales.`;

    return await callAI([
      {
        role: 'system',
        content: 'Eres un traductor profesional especializado en textos inmobiliarios. Traduces manteniendo el profesionalismo y la persuasión del texto original.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ]);
  };

  const suggestPrice = async (propertyData) => {
    const prompt = `
Analiza estos datos del inmueble y sugiere un precio competitivo:

- Tipo: ${propertyData.tipo}
- Ubicación: ${propertyData.location}
- Área: ${propertyData.area}
- Dormitorios: ${propertyData.bedrooms}
- Baños: ${propertyData.bathrooms}
- Condición: ${propertyData.condition || 'Buena'}
- Amenidades: ${propertyData.amenities || 'Estándar'}
- Precio actual (si existe): ${propertyData.currentPrice || 'No especificado'}

Por favor, sugiere un rango de precios realista basado en el mercado y justifica tu análisis. Incluye:
1. Precio sugerido (rango)
2. Factores que afectan el precio
3. Comparables en la zona
4. Recomendación final`;

    return await callAI([
      {
        role: 'system',
        content: 'Eres un analista de mercado inmobiliario con experiencia en evaluación de propiedades. Proporcionas análisis detallados y realistas de precios basados en datos de mercado.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ]);
  };

  const generateAutoReply = async (customerMessage, propertyContext) => {
    const prompt = `
Un cliente envió el siguiente mensaje sobre una propiedad:
"${customerMessage}"

Contexto de la propiedad:
- Tipo: ${propertyContext.tipo}
- Ubicación: ${propertyContext.location}
- Precio: ${propertyContext.price}
- Disponibilidad: ${propertyContext.availability || 'Disponible'}

Por favor, genera una respuesta profesional, amable y completa que:
1. Agradezca al cliente su interés
2. Aborde específicamente su pregunta o interés
3. Proporcione información útil sobre la propiedad
4. Invite a una visita o contacto directo
5. Incluya un tono profesional pero cercano

La respuesta debe ser concisa pero completa (máximo 150 palabras).`;

    return await callAI([
      {
        role: 'system',
        content: 'Eres un agente inmobiliario profesional que responde consultas de clientes. Eres amable, informativo y persuasivo. Siempre busca convertir el interés en una cita o contacto.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ]);
  };

  return (
    <AIContext.Provider value={{
      apiKey,
      isConfigured,
      loading,
      error,
      saveApiKey,
      clearApiKey,
      callAI,
      generateDescription,
      translateDescription,
      suggestPrice,
      generateAutoReply,
      setError,
    }}>
      {children}
    </AIContext.Provider>
  );
}

export function useAI() {
  return useContext(AIContext);
}
