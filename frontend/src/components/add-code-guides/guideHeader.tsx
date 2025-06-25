import { Code } from "lucide-react";
const Header = () => (
  <div className="text-center mb-8">
    <div className="flex items-center justify-center gap-3 mb-4">
      <div className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
        <Code className="w-8 h-8 text-white" />
      </div>
      <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
        Code Guide Editor
      </h1>
    </div>
    <p className="text-slate-400 text-lg">Create interactive code tutorials with step-by-step explanations</p>
  </div>
);

export default Header
