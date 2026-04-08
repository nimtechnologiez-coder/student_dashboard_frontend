'use client';

export default function GlobalError({ error, reset }) {
    return (
        <html>
            <body>
                <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
                    <h2>Application Error</h2>
                    <pre style={{ background: '#f0f0f0', padding: '10px', overflow: 'auto' }}>
                        {error.message}
                    </pre>
                    <pre style={{ fontSize: '12px', color: '#666' }}>
                        {error.stack}
                    </pre>
                    <button onClick={() => reset()}>Try again</button>
                </div>
            </body>
        </html>
    );
}




