'use server';
/**
 * @fileOverview This file defines tools for finding emergency services.
 * In a real application, these would be connected to actual location and provider APIs.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Mock location data. In a real app, you would use a location service.
const MOCK_LOCATION = {
    city: 'Mountain View',
    state: 'CA',
    zip: '94043'
};

// Mock provider data. In a real app, this would come from a database or API.
const MOCK_SERVICES = {
    'hospital': [
        { name: 'El Camino Hospital', phone: '650-940-7000', address: '2500 Grant Rd, Mountain View, CA 94040' },
        { name: 'Stanford Health Care', phone: '650-723-4000', address: '300 Pasteur Dr, Stanford, CA 94305' },
    ],
    'police': [
        { name: 'Mountain View Police Department', phone: '911 or (650) 903-6344', address: '1000 Villa St, Mountain View, CA 94041' },
    ],
    'doctor': [
        { name: 'Palo Alto Medical Foundation', phone: '650-934-7000', address: '701 E El Camino Real, Mountain View, CA 94040' },
    ]
};

export const getUserLocation = ai.defineTool(
    {
        name: 'getUserLocation',
        description: 'Gets the user\'s current geographical location to find nearby services.',
        inputSchema: z.object({}),
        outputSchema: z.object({
            city: z.string(),
            state: z.string(),
            zip: z.string(),
        }),
    },
    async () => {
        // In a real application, this would involve an API call to a location service.
        // For this demo, we return a mock location.
        console.log('Tool: getUserLocation called. Returning mock location.');
        return MOCK_LOCATION;
    }
);

export const findNearbyServices = ai.defineTool(
    {
        name: 'findNearbyServices',
        description: 'Finds nearby emergency services like hospitals or police stations.',
        inputSchema: z.object({
            serviceType: z.enum(['hospital', 'police', 'doctor']).describe('The type of service to search for.'),
            location: z.object({
                city: z.string(),
                state: z.string(),
                zip: z.string(),
            }).describe("The user's location."),
        }),
        outputSchema: z.array(z.object({
            name: z.string(),
            phone: z.string(),
            address: z.string(),
        })),
    },
    async (input) => {
        console.log(`Tool: findNearbyServices called for ${input.serviceType} in ${input.location.city}`);
        // This is a mock implementation. A real one would query a database or an external API.
        const services = MOCK_SERVICES[input.serviceType] || [];
        return services;
    }
);
