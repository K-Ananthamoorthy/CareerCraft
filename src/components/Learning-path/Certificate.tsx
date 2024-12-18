import React from 'react';

interface CertificateProps {
  userName: string;
  courseName: string;
  issueDate: string;
}

const Certificate: React.FC<CertificateProps> = ({ userName, courseName, issueDate }) => {
  return (
    <div className="relative w-[794px] h-[1123px] mx-auto bg-gradient-to-br from-blue-100 via-white to-purple-100 border-8 border-blue-800 shadow-2xl">
      <div className="absolute border-2 border-blue-600 inset-2" />
      
      {/* Achievement Badge */}
      <div className="absolute flex items-center justify-center w-24 h-24 transform bg-yellow-400 rounded-full top-4 right-4 rotate-12">
        <div className="text-center">
          <p className="text-xs font-bold text-blue-800">Achievement</p>
          <p className="text-xs font-bold text-blue-800">Unlocked</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between h-full p-12">
        <div className="w-full text-center">
          <h1 className="mb-8 text-5xl font-bold text-blue-800">CareerCrafters</h1>
          <h2 className="mb-6 text-4xl font-bold text-blue-800">Certificate of Completion</h2>
          <div className="w-3/4 h-1 mx-auto mb-8 bg-blue-800" />
          <p className="mb-6 text-xl text-gray-700">This is to certify that</p>
          <h3 className="mb-6 text-3xl font-bold text-blue-900">{userName}</h3>
          <p className="mb-6 text-xl text-gray-700">has successfully completed the course</p>
          <h4 className="mb-8 text-2xl font-bold text-blue-900">{courseName}</h4>
          <p className="max-w-2xl mx-auto mb-8 text-xl text-gray-700">
            with distinction and demonstrated exceptional skills and knowledge in the subject matter.
          </p>
          <p className="text-xl text-gray-700">Issued on: {issueDate}</p>
        </div>
        <div className="w-full mt-16 text-center">
          <p className="max-w-2xl mx-auto mb-8 text-lg text-gray-700">
            This certificate is awarded in recognition of the dedication, hard work, and academic excellence demonstrated throughout the course.
          </p>
          <div className="relative flex items-center justify-center mt-16">
            <div className="flex items-center justify-center w-48 h-48 overflow-hidden bg-blue-100 border-4 border-blue-800 rounded-full">
              <div className="text-center">
                <p className="text-xs font-bold text-blue-800">CareerCrafters</p>
                <p className="text-xs font-bold text-blue-800">Official Seal</p>
                <svg viewBox="0 0 100 100" className="absolute w-32 h-32 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                  <path
                    id="curve"
                    fill="transparent"
                    d="M 50 10 A 40 40 0 0 1 50 90 A 40 40 0 0 1 50 10"
                  />
                  <text fontSize="8">
                    <textPath xlinkHref="#curve" startOffset="0%">
                      CareerCrafters • Official Certificate • {new Date().getFullYear()}
                    </textPath>
                  </text>
                </svg>
              </div>
            </div>
          </div>
          <p className="mt-8 text-sm text-gray-600">CareerCrafters - Empowering Your Professional Journey</p>
          <p className="text-sm text-gray-600">Certificate ID: {Math.random().toString(36).substr(2, 9)}</p>
        </div>
      </div>
    </div>
  );
};

export default Certificate;

