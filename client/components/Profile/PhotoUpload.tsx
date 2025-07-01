import { ChangeEvent } from 'react'

type PhotoProps = {
  newPhoto: File | null
  onChange: (file: File | null) => void
  fileInputRef?: React.RefObject<HTMLInputElement>
}

export default function UploadPhoto({
  newPhoto,
  onChange,
  fileInputRef,
}: PhotoProps) {
  function handlePhotoChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      onChange(e.target.files[0])
    } else {
      onChange(null)
    }
  }

  return (
    <div className="mb-4">
      <label htmlFor="avatar_upload" className="mb-1 block font-medium">
        Upload New Photo
      </label>
      <input
        id="avatar_upload"
        type="file"
        accept="image/*"
        onChange={handlePhotoChange}
        ref={fileInputRef}
        className="w-full rounded border px-3 py-2"
      />
      {newPhoto && (
        <p className="mt-1 text-xs text-gray-500">{newPhoto.name}</p>
      )}
    </div>
  )
}
