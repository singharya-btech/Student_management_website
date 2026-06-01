export default function LoadingSpinner(){
  return (
    <div className="flex items-center justify-center p-10">
      <div className="h-14 w-14 rounded-full border-4 border-white/10 border-t-transparent border-indigo-500 animate-spin" />
    </div>
  )
}
