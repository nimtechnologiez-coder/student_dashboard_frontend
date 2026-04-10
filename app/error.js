'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h2>Something went wrong!</h2>
            <pre style={{ background: '#f0f0f0', padding: '10px', overflow: 'auto', color: 'red' }}>
                {error.message}
            </pre>
            {error.digest && <p>Digest: {error.digest}</p>}
            <button
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }
                style={{ marginTop: '10px', padding: '10px 20px', cursor: 'pointer' }}
            >
                Try again
            </button>
        </div>
    );
}




