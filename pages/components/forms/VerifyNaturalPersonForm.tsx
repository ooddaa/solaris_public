import React from 'react'
import { EnhancedNode} from '../../types'
import isArray from 'lodash/isArray'
interface VerifyNaturalPersonFormProps {
  verificationRequests: EnhancedNode[];
}

const renderVerificationRequest = (verificationRequest: EnhancedNode): JSX.Element => {
  const { labels, properties } = verificationRequest
  return (
    <div className="verification-request">
      {/* { properties.} */}
      {JSON.stringify(properties, null, 5)}
    </div>
  )
}

const VerifyNaturalPersonForm = ({ verificationRequests }: VerifyNaturalPersonFormProps) => {
  return (
    <div>{
      (verificationRequests && isArray(verificationRequests))? 
      verificationRequests.map(renderVerificationRequest)
      : 'no verification requests'
      }</div>
  )
}

export default VerifyNaturalPersonForm