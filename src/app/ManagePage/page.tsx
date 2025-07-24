import { Checkbox } from "@/components/ui/checkbox"

export default function ManagePage() {
  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#fafbfc' }}>
      <div className="flex items-center space-x-2">
        <Checkbox id="terms" />
      </div>
    </div>
  )
}
