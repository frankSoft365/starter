import { Client, type IMessage } from '@stomp/stompjs';

let client: Client | null = null;

export function getStompClient(): Client {
    if (client) return client;

    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const brokerURL = `${protocol}://${import.meta.env.VITE_WS_HOST}/ws`;

    client = new Client({
        brokerURL,
        reconnectDelay: 5000,
        heartbeatIncoming: 10000,
        heartbeatOutgoing: 10000,
        onStompError: (frame) => {
            console.error('STOMP error', frame.headers?.message, frame.body);
        },
        onWebSocketError: (event) => {
            console.error('WebSocket error', event);
        },
    });

    client.activate();
    return client;
}

export function resetStompClient(): void {
    client?.deactivate();
    client = null;
}

export type { IMessage };