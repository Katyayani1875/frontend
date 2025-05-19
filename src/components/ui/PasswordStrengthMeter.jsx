import React from "react";

export const PasswordStrengthMeter = ({ password }) => {
  const getStrength = () => {
    if (!password) return 0;
    if (password.length > 10 && /[\W]/.test(password)) return 100;
    if (password.length > 6) return 60;
    return 30;
  };

  const strength = getStrength();

  return (
    <div className="mt-2">
      <div className="h-2 bg-gray-700 rounded">
        <div
          className={`h-full rounded ${
            strength > 80 ? "bg-green-500" : strength > 50 ? "bg-yellow-500" : "bg-red-500"
          }`}
          style={{ width: `${strength}%` }}
        />
      </div>
    </div>
  );
};
