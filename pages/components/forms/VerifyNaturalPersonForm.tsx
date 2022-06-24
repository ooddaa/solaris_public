import React from 'react'

interface VerifyNaturalPersonForm {
  verifyPerson: (data: string) => void;
}

function VerifyNaturalPersonForm({ verifyPerson }: VerifyNaturalPersonForm) {
  return (
    <div>VerifyNaturalPersonForm</div>
  )
}

export default VerifyNaturalPersonForm