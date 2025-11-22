
import React, { useState, useRef } from 'react';
import { InputData, CoverLetterItem, InterviewLevel } from '../types';

interface InputFormProps {
  onSubmit: (data: InputData) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  // --- STATE MANAGEMENT ---
  // 0. Config
  const [interviewLevel, setInterviewLevel] = useState<InterviewLevel>('junior');
  const [timeLimitSeconds, setTimeLimitSeconds] = useState<number | ''>('');

  // 1. Company Info
  const [talentIdeal, setTalentIdeal] = useState('');
  const [jdType, setJdType] = useState<'text' | 'file' | 'url'>('text');
  const [jobDescription, setJobDescription] = useState('');
  const [jdFile, setJdFile] = useState<{ name: string, base64: string, mime: string } | null>(null);

  // 2. Candidate Info
  const [docType, setDocType] = useState<'resume' | 'coverLetter'>('resume');
  const [resumeType, setResumeType] = useState<'text' | 'file' | 'notion'>('text');
  const [resumeText, setResumeText] = useState('');
  const [resumeFile, setResumeFile] = useState<{ name: string, base64: string, mime: string } | null>(null);
  const [coverLetterItems, setCoverLetterItems] = useState<CoverLetterItem[]>([
    { question: '', answer: '' }
  ]);

  // 3. Code Info
  const [githubUrls, setGithubUrls] = useState<string[]>(['']);
  const [githubToken, setGithubToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const resumeFileInputRef = useRef<HTMLInputElement>(null);

  // --- HANDLERS ---

  // File Upload Handler
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>, 
    setFileState: React.Dispatch<React.SetStateAction<{ name: string, base64: string, mime: string } | null>>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileState({
          name: file.name,
          base64: reader.result as string,
          mime: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Dynamic Cover Letter Q&A
  const addCoverLetterItem = () => {
    setCoverLetterItems([...coverLetterItems, { question: '', answer: '' }]);
  };
  const removeCoverLetterItem = (index: number) => {
    if (coverLetterItems.length > 1) {
      setCoverLetterItems(coverLetterItems.filter((_, i) => i !== index));
    }
  };
  const updateCoverLetter = (index: number, field: keyof CoverLetterItem, value: string) => {
    const newItems = [...coverLetterItems];
    newItems[index][field] = value;
    setCoverLetterItems(newItems);
  };

  // Dynamic GitHub URLs
  const addRepo = () => setGithubUrls([...githubUrls, '']);
  const removeRepo = (index: number) => {
    if (githubUrls.length > 1) setGithubUrls(githubUrls.filter((_, i) => i !== index));
  };
  const updateRepo = (index: number, value: string) => {
    const newUrls = [...githubUrls];
    newUrls[index] = value;
    setGithubUrls(newUrls);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validations
    if (githubUrls.some(url => !url.includes('github.com'))) {
      alert('유효한 GitHub URL을 입력해주세요.');
      return;
    }
    if (docType === 'coverLetter' && coverLetterItems.some(item => !item.question.trim() || !item.answer.trim())) {
      alert('자소서의 질문과 답변을 모두 입력해주세요.');
      return;
    }
    if (jdType === 'text' && !jobDescription.trim()) {
       alert('채용 공고 내용을 입력해주세요.');
       return;
    }

    const formData: InputData = {
      interviewLevel,
      timeLimitSeconds: timeLimitSeconds === '' ? undefined : Number(timeLimitSeconds),
      talentIdeal,
      jdType,
      jobDescription,
      jdFileBase64: jdFile?.base64,
      jdFileMimeType: jdFile?.mime,
      docType,
      resumeType,
      resumeText,
      resumeFileBase64: resumeFile?.base64,
      resumeFileMimeType: resumeFile?.mime,
      coverLetterItems,
      githubUrls: githubUrls.filter(u => u.trim() !== ''),
      githubToken
    };

    onSubmit(formData);
  };

  const fillDemoData = () => {
    setInterviewLevel('mid3');
    setTalentIdeal('도전적이고 주도적인 인재, 기술적 깊이를 추구하는 개발자');
    setJdType('text');
    setJobDescription(`[백엔드 개발자 채용]
- 대용량 트래픽 처리 경험 필수
- MSA(Microservices Architecture) 설계 및 운영 경험
- Redis, Kafka 등을 활용한 이벤트 기반 아키텍처`);
    setDocType('coverLetter');
    setCoverLetterItems([
      { 
        question: '가장 도전적이었던 기술적 경험은?', 
        answer: '대규모 트래픽 처리를 위해 Redis 캐싱 전략을 도입했습니다. 기존 DB 부하를 80% 줄이고 응답 속도를 개선했습니다.' 
      },
      {
        question: '협업 시 갈등 해결 경험?',
        answer: '코드 리뷰 문화가 없던 팀에 PR 도입을 제안했고, 초기 반발이 있었으나 CI/CD 파이프라인을 구축하여 배포 안정성을 증명하며 설득했습니다.'
      }
    ]);
    setGithubUrls(['https://github.com/spring-projects/spring-petclinic']);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-lg transition-colors duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            분석 설정 및 자료 입력
          </h2>
          <button 
            type="button" 
            onClick={fillDemoData}
            className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 underline decoration-dotted"
          >
            데모 데이터 채우기
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* SECTION 0: CONFIG */}
          <div className="space-y-4 border-b border-slate-200 dark:border-slate-700 pb-8">
            <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">0. 면접 설정 (Configuration)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">면접 난이도 (Level)</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'intern', label: 'Intern (인턴)' },
                    { id: 'junior', label: 'Junior (신입)' },
                    { id: 'mid3', label: 'Mid-Level (3년차)' },
                    { id: 'mid5', label: 'Mid-Level (5년차)' }
                  ].map((level) => (
                    <button
                      key={level.id}
                      type="button"
                      onClick={() => setInterviewLevel(level.id as InterviewLevel)}
                      className={`px-3 py-2 text-xs font-bold rounded-lg border transition-all ${
                        interviewLevel === level.id
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/30 dark:shadow-indigo-900/50'
                          : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">답변 제한 시간 (초)</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="300"
                    value={timeLimitSeconds}
                    onChange={(e) => setTimeLimitSeconds(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="예: 30 (비워두면 무제한)"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 pl-10 text-sm text-slate-900 dark:text-slate-300 focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">* 설정 시 면접관이 답변 길이를 체크합니다.</p>
              </div>
            </div>
          </div>

          {/* SECTION 1: COMPANY INFO */}
          <div className="space-y-4 border-b border-slate-200 dark:border-slate-700 pb-8">
            <h3 className="text-sm font-bold text-rose-500 dark:text-rose-400 uppercase tracking-wide">1. 기업 정보 (Target)</h3>
            
            {/* Talent Ideal */}
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">기업 인재상 (Core Values)</label>
              <input
                type="text"
                value={talentIdeal}
                onChange={(e) => setTalentIdeal(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-900 dark:text-slate-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="예: 실패를 두려워하지 않는 도전, 고객 중심 사고..."
              />
            </div>

            {/* JD Input with Tabs */}
            <div>
              <div className="flex items-center justify-between mb-2">
                 <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">채용 공고 (JD)</label>
                 <div className="flex bg-slate-100 dark:bg-slate-900 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
                   {(['text', 'file', 'url'] as const).map((mode) => (
                     <button
                       key={mode}
                       type="button"
                       onClick={() => setJdType(mode)}
                       className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                         jdType === mode 
                          ? 'bg-rose-600 text-white shadow-sm' 
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                       }`}
                     >
                       {mode === 'text' ? '텍스트' : mode === 'file' ? '파일(이미지/PDF)' : 'URL'}
                     </button>
                   ))}
                 </div>
              </div>
              
              {jdType === 'text' && (
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="w-full h-32 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-sm text-slate-900 dark:text-slate-300 focus:ring-2 focus:ring-rose-500 resize-none"
                  placeholder="채용 공고 내용을 복사해서 붙여넣으세요..."
                />
              )}
              {jdType === 'file' && (
                 <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center hover:border-rose-500 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      accept="image/*,application/pdf" 
                      onChange={(e) => handleFileChange(e, setJdFile)} 
                      className="hidden" 
                    />
                    <div className="text-slate-500 dark:text-slate-400 text-sm">
                      {jdFile ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-center gap-2">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          {jdFile.name}
                        </span>
                      ) : (
                        <>
                          <p>공고 이미지를 클릭하여 업로드하세요</p>
                          <p className="text-xs text-slate-400 dark:text-slate-600 mt-1">(JPG, PNG, PDF 지원)</p>
                        </>
                      )}
                    </div>
                 </div>
              )}
              {jdType === 'url' && (
                 <input
                   type="url"
                   value={jobDescription} // Reuse state but treat as URL
                   onChange={(e) => setJobDescription(e.target.value)}
                   className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-900 dark:text-slate-300 focus:ring-2 focus:ring-rose-500"
                   placeholder="채용 공고 링크 (URL)"
                 />
              )}
            </div>
          </div>

          {/* SECTION 2: CANDIDATE INFO */}
          <div className="space-y-4 border-b border-slate-200 dark:border-slate-700 pb-8">
            <div className="flex items-center gap-4 mb-2">
              <h3 className="text-sm font-bold text-rose-500 dark:text-rose-400 uppercase tracking-wide">2. 지원자 서류 (Source)</h3>
              <div className="flex bg-slate-100 dark:bg-slate-900 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
                 <button type="button" onClick={() => setDocType('resume')} className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${docType === 'resume' ? 'bg-emerald-600 text-white' : 'text-slate-500 dark:text-slate-400'}`}>이력서/경력기술서</button>
                 <button type="button" onClick={() => setDocType('coverLetter')} className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${docType === 'coverLetter' ? 'bg-emerald-600 text-white' : 'text-slate-500 dark:text-slate-400'}`}>자기소개서(Q&A)</button>
              </div>
            </div>

            {/* Resume Mode */}
            {docType === 'resume' && (
               <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                 <div className="flex gap-4 mb-3 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" checked={resumeType === 'text'} onChange={() => setResumeType('text')} className="text-emerald-500 focus:ring-emerald-500 bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600" />
                      <span className="text-slate-600 dark:text-slate-300">텍스트 붙여넣기</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" checked={resumeType === 'file'} onChange={() => setResumeType('file')} className="text-emerald-500 focus:ring-emerald-500 bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600" />
                      <span className="text-slate-600 dark:text-slate-300">파일 업로드 (PDF)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" checked={resumeType === 'notion'} onChange={() => setResumeType('notion')} className="text-emerald-500 focus:ring-emerald-500 bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600" />
                      <span className="text-slate-600 dark:text-slate-300">노션/링크</span>
                    </label>
                 </div>

                 {resumeType === 'text' && (
                   <textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    className="w-full h-40 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-600 rounded p-3 text-sm text-slate-900 dark:text-slate-300"
                    placeholder="경력 기술서나 포트폴리오 내용을 텍스트로 입력하세요."
                   />
                 )}
                 {resumeType === 'file' && (
                   <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-emerald-500 transition-colors" onClick={() => resumeFileInputRef.current?.click()}>
                      <input 
                        ref={resumeFileInputRef}
                        type="file" 
                        accept="application/pdf,image/*" 
                        onChange={(e) => handleFileChange(e, setResumeFile)} 
                        className="hidden" 
                      />
                      <div className="text-slate-500 dark:text-slate-400 text-sm">
                        {resumeFile ? <span className="text-emerald-600 dark:text-emerald-400 font-bold">{resumeFile.name}</span> : "이력서 PDF 업로드"}
                      </div>
                   </div>
                 )}
                 {resumeType === 'notion' && (
                   <input
                    type="url"
                    value={resumeText} // Reuse text state for URL
                    onChange={(e) => setResumeText(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-600 rounded px-4 py-2 text-sm text-slate-900 dark:text-slate-300"
                    placeholder="https://notion.so/..."
                   />
                 )}
               </div>
            )}

            {/* Cover Letter Mode (Dynamic Q&A) */}
            {docType === 'coverLetter' && (
              <div className="space-y-3">
                {coverLetterItems.map((item, idx) => (
                  <div key={idx} className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700 relative group">
                    <div className="absolute top-2 right-2">
                       {coverLetterItems.length > 1 && (
                         <button type="button" onClick={() => removeCoverLetterItem(idx)} className="text-slate-400 hover:text-rose-500">
                           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                         </button>
                       )}
                    </div>
                    <div className="mb-2">
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-500 mb-1">질문 (Question) #{idx + 1}</label>
                      <input
                        type="text"
                        value={item.question}
                        onChange={(e) => updateCoverLetter(idx, 'question', e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-600 rounded px-3 py-2 text-sm text-slate-900 dark:text-slate-300 font-bold"
                        placeholder="예: 가장 힘들었던 기술적 경험은?"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-500 mb-1">답변 (Answer)</label>
                      <textarea
                        value={item.answer}
                        onChange={(e) => updateCoverLetter(idx, 'answer', e.target.value)}
                        className="w-full h-24 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-600 rounded p-3 text-sm text-slate-900 dark:text-slate-300 resize-none"
                        placeholder="답변 내용을 입력하세요."
                      />
                    </div>
                  </div>
                ))}
                <button type="button" onClick={addCoverLetterItem} className="w-full py-2 border border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-slate-500 dark:text-slate-400 text-sm hover:border-emerald-500 hover:text-emerald-500 transition-colors">
                  + 문항 추가하기
                </button>
              </div>
            )}
          </div>

          {/* SECTION 3: GITHUB REPOS */}
          <div className="p-5 bg-slate-50 dark:bg-slate-900/80 rounded-lg border border-slate-200 dark:border-slate-700">
             <label className="block text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path></svg>
              GitHub Repository (코드 증명)
            </label>
            
            <div className="space-y-2">
              {githubUrls.map((url, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => updateRepo(idx, e.target.value)}
                    placeholder="https://github.com/username/repo"
                    className="flex-1 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 text-sm text-slate-900 dark:text-slate-300 focus:ring-1 focus:ring-rose-500 font-mono"
                  />
                  {githubUrls.length > 1 && (
                     <button type="button" onClick={() => removeRepo(idx)} className="bg-slate-100 dark:bg-slate-800 px-3 rounded border border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-rose-100 dark:hover:bg-rose-900 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-500">
                        -
                     </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addRepo} className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 flex items-center gap-1 mt-2">
                <span className="bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">+ 레포지토리 추가</span>
              </button>
            </div>

            {/* Token Section (Collapsed) */}
            <div className="mt-4 border-t border-slate-200 dark:border-slate-800 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowTokenInput(!showTokenInput)}
                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-400 transition-colors group"
                >
                  <svg className={`w-3 h-3 transform transition-transform ${showTokenInput ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                  <span className="group-hover:underline">API Rate Limit 해제 (Token 입력)</span>
                </button>
                
                {showTokenInput && (
                  <div className="mt-2 p-3 bg-white dark:bg-slate-950/80 rounded-lg border border-slate-200 dark:border-slate-800">
                     <input
                      type="password"
                      value={githubToken}
                      onChange={(e) => setGithubToken(e.target.value)}
                      placeholder="ghp_..."
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-xs text-slate-900 dark:text-slate-300 focus:ring-1 focus:ring-emerald-500 font-mono"
                    />
                    <a href="https://github.com/settings/tokens/new?description=FactCheckAI&scopes=public_repo" target="_blank" rel="noreferrer" className="text-[10px] text-emerald-500 hover:underline mt-1 inline-block">
                       👉 토큰 발급받기
                    </a>
                  </div>
                )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 rounded-lg font-bold text-white text-lg shadow-lg transition-all transform active:scale-[0.98] 
              ${isLoading 
                ? 'bg-slate-400 dark:bg-slate-700 cursor-wait' 
                : 'bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 shadow-rose-500/30 dark:shadow-rose-900/50'
              }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                 <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                코드 전체 스캔 및 분석 중...
              </span>
            ) : (
              '약점 기반 질문 확인'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InputForm;
