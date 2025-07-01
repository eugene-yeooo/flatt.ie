import { ChangeEvent } from 'react'

type PhotoProps = {
  newPhoto: File | null
  onChange: (file: File | null) => void
}

export default function UploadPhoto({ newPhoto, onChange }: PhotoProps) {
  function handlePhotoChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      onChange(e.target.files[0])
    }
  }

  return (
    <div>
      <input type="file" accept="image/*" onChange={handlePhotoChange} />
      {newPhoto && (
        <p className="mt-1 text-xs text-gray-500">{newPhoto.name}</p>
      )}
    </div>
  )
}
