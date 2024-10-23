import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import WrapperContent from "../../../components/WrapperContent/WrapperContent";
import EnterEmail from "./EnterEmail";
import EnterOtp from "./EnterOtp";
import ResetPassword from "./ResetPassword";

export const STEP = {
  ENTER_EMAIL: "ENTER_EMAIL",
  ENTER_OTP: "ENTER_OTP",
  RESET_PASSWORD: "RESET_PASSWORD",
};

const ForgotPassword = () => {
  const [step, setStep] = useState(STEP.ENTER_EMAIL);

  const valuesRef = useRef();

  const navigate = useNavigate();

  const onBack = () => navigate(-1);

  return (
    <div className="bg-gray-100 py-11 px-8">
      <WrapperContent className="bg-white py-11 rounded px-4">
        <h1 className="text-center font-semibold text-2xl uppercase mb-6">
          Forgot Password
        </h1>

        {step === STEP.ENTER_EMAIL && (
          <EnterEmail
            onStepChange={setStep}
            onBack={onBack}
            valuesRef={valuesRef}
          />
        )}

        {step === STEP.ENTER_OTP && (
          <EnterOtp onStepChange={setStep} valuesRef={valuesRef} />
        )}

        {step === STEP.RESET_PASSWORD && (
          <ResetPassword onStepChange={setStep} valuesRef={valuesRef} />
        )}
      </WrapperContent>
    </div>
  );
};

export default ForgotPassword;
