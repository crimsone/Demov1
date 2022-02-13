import Image from 'next/image';
// pages/404.js
export default function Custom404() {
  return (
    <div className="min-w-full min-h-screen flex items-center justify-center">
      <div>
        <p className="font-bold text-red-400 text-2xl mb-4">
          404 - Page Not Found
        </p>
        <Image
          src="/static/404-error.png"
          alt="Not found"
          width={300}
          height={300}
        />
      </div>
    </div>
  )
}