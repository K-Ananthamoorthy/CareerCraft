import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Terms() {
  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Terms of Service</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>1. Acceptance of Terms</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            By accessing or using the CareerCrafters, you agree to be bound by these Terms of Service. 
            If you do not agree to these terms, please do not use our platform.
          </p>
        </CardContent>
      </Card>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>2. User Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            You are responsible for maintaining the confidentiality of your account and password. 
            You agree to accept responsibility for all activities that occur under your account.
          </p>
        </CardContent>
      </Card>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>3. Intellectual Property</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            The content, features, and functionality of the  CareerCrafters are owned by us and 
            are protected by international copyright, trademark, patent, trade secret, and other 
            intellectual property laws.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>4. Limitation of Liability</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            To the fullest extent permitted by law, CareerCrafters  shall not be liable for any 
            indirect, incidental, special, consequential, or punitive damages, or any loss of profits 
            or revenues, whether incurred directly or indirectly.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}