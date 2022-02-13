import Image from 'next/image';
// pages/500.js
export default function Custom500() {
  return (
    <div className="min-w-full min-h-screen flex items-center justify-center">
      <div>
        <p className="font-bold text-red-400 text-2xl mb-4">
          500 - Server-side error occurred
        </p>
        <Image
          src="/static/server-error.png"
          alt="Not found"
          width={300}
          height={300}
        />
      </div>
    </div>
  )
}