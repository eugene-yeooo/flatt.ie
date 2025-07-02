import { ChangeEvent, useState, useEffect } from 'react'

type PhotoProps = {
  newPhoto: File | null
  onChange: (file: File | null) => void
  fileInputRef: React.RefObject<HTMLInputElement>
}

export default function UploadPhoto({
  newPhoto,
  onChange,
  fileInputRef,
}: PhotoProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!newPhoto) {
      setPreviewUrl(null)
      return
    }

    const url = URL.createObjectURL(newPhoto)
    console.log(url)
    setPreviewUrl(url)

    return () => {
      URL.revokeObjectURL(url)
    }
  }, [newPhoto])

  function handlePhotoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    onChange(file)
  }

  return (
    <div className="mb-4">
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="mb-2 mt-4 justify-center rounded bg-[var(--primary)] px-4 py-2 text-[var(--primary-foreground)] transition duration-200 hover:bg-[var(--accent)]"
      >
        Upload New Profile Photo
      </button>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handlePhotoChange}
        className="hidden"
      />

      {previewUrl && (
        <div className="mt-2">
          <img
            src={previewUrl}
            alt="Preview"
            className="max-h-48 rounded border border-gray-300"
          />
          <p className="mt-1 text-sm text-gray-600">{newPhoto?.name}</p>
        </div>
      )}
    </div>
  )
}
