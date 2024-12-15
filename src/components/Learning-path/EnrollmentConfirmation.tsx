import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

interface EnrollmentConfirmationProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  learningPath: {
    title: string
    duration: string
    level: string
  }
}

export default function EnrollmentConfirmation({ isOpen, onClose, onConfirm, learningPath }: EnrollmentConfirmationProps) {
  const [agreeToTerms, setAgreeToTerms] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Enrollment</DialogTitle>
          <DialogDescription>
            You are about to enroll in the following course:
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col space-y-1.5">
            <h3 className="font-semibold">{learningPath.title}</h3>
            <p>Duration: {learningPath.duration}</p>
            <p>Level: {learningPath.level}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" checked={agreeToTerms} onCheckedChange={(checked) => setAgreeToTerms(checked === true)} />
            <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              I agree to the terms and conditions
            </label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onConfirm} disabled={!agreeToTerms}>Confirm Enrollment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

