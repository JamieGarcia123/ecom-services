import { Handler } from '@netlify/functions';
import fs from 'fs';
import path from 'path';

const handler: Handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const servicesPath = path.join(process.cwd(), 'public/data/services.json');
    
    if (event.httpMethod === 'GET') {
      // Get all services
      const services = JSON.parse(fs.readFileSync(servicesPath, 'utf8'));
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(services),
      };
    }
    
    if (event.httpMethod === 'POST') {
      // Add new service
      const newService = JSON.parse(event.body || '{}');
      const services = JSON.parse(fs.readFileSync(servicesPath, 'utf8'));
      
      // Generate new ID
      const maxId = Math.max(...services.map((s: any) => s.id), 0);
      newService.id = maxId + 1;
      newService.active = true;
      
      services.push(newService);
      fs.writeFileSync(servicesPath, JSON.stringify(services, null, 2));
      
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(newService),
      };
    }
    
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

export { handler };
