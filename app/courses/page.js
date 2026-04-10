import { Suspense } from 'react'
import CoursePage from '../../components/course'

export default function Courses() {
    return (
        <main className="min-h-screen bg-[#02040a]">
            {/* 
                CoursePage handles both the catalog grid and the details view 
                based on ?courseId= search param.
            */}
            <Suspense fallback={<div className="min-h-screen bg-[#02040a] flex items-center justify-center text-white">Loading...</div>}>
                <CoursePage />
            </Suspense>
        </main>
    )
}




