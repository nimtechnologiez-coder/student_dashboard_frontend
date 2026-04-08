'use client';
import React from 'react';
import dynamic from 'next/dynamic';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

const TestPage = () => {
    // This is the file I found in uploads: 1771398914133.mp4
    const url = `${process.env.NEXT_PUBLIC_API_URL}/uploads/1771398914133.mp4`;

    return (
        <div style={{ padding: 50 }}>
            <h1>Video Test</h1>
            <p>URL: {url}</p>
            <div style={{ border: '2px solid red', width: 640, height: 360 }}>
                <ReactPlayer
                    url={url}
                    width="100%"
                    height="100%"
                    controls={true}
                    playing={true}
                    onError={(e) => console.error('ReactPlayer Error:', e)}
                />
            </div>
            <br />
            <h2>Native Video Tag</h2>
            <video src={url} controls width="640" height="360" style={{ border: '2px solid blue' }} />
        </div>
    );
};

export default TestPage;




