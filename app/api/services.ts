import fs from 'fs';
import path from 'path';

export async function action({ request }: { request: Request }) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const formData = await request.formData();
    const serviceData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      category: formData.get('category') as string,
      provider: formData.get('provider') as string,
      duration: formData.get('duration') as string,
      image: formData.get('image') as string || '/images/default-service.jpg'
    };

    // Read current services
    const servicesPath = path.join(process.cwd(), 'public', 'data', 'services.json');
    const currentData = fs.readFileSync(servicesPath, 'utf8');
    const services = JSON.parse(currentData);

    // Add new service with next available ID
    const newService = {
      ...serviceData,
      id: Math.max(...services.map((s: any) => s.id), 0) + 1,
      active: true
    };

    services.push(newService);

    // Write back to file
    fs.writeFileSync(servicesPath, JSON.stringify(services, null, 2));

    return new Response(JSON.stringify({ success: true, service: newService }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error adding service:', error);
    return new Response(JSON.stringify({ success: false, error: 'Failed to add service' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
