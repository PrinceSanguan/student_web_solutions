'use client';

import { Terminal } from '@/components/ui/terminal';

const COMMANDS = ['Browse catalog', 'Select your capstone/system', 'Message the developer', 'Receive complete source code (ZIP)'];

const OUTPUTS: Record<number, string[]> = {
    0: ['✔ Viewing available capstone projects...'],
    1: ['✔ System selected successfully.'],
    2: ['✔ Connected with the developer.'],
    3: ['✔ Download ready!', '✔ Includes full source code', '✔ With documentation', '✔ With setup tutorial'],
};

export default function TerminalSection() {
    return (
        <section className="bg-white py-16 sm:py-20 md:py-24">
            <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-4 text-center">
                    <h2 className="mb-4 bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
                        How it works
                    </h2>
                    <p className="mx-auto max-w-xl text-gray-500">
                        Get a complete, submission-ready capstone project built to your requirements. Message the developer to discuss pricing and get
                        started.
                    </p>
                </div>

                {/* Value highlight */}
                <div className="mb-10 flex justify-center">
                    <div className="inline-flex flex-wrap justify-center gap-x-6 gap-y-2 rounded-full border border-green-500/30 bg-green-50 px-6 py-3 text-sm text-green-600">
                        <span>✅ Complete source code</span>
                        <span>✅ Full documentation</span>
                        <span>✅ Ready for submission</span>
                        <span>✅ Setup tutorial included</span>
                    </div>
                </div>

                {/* Terminal */}
                <Terminal
                    commands={COMMANDS}
                    outputs={OUTPUTS}
                    username="student@sws"
                    typingSpeed={45}
                    delayBetweenCommands={1000}
                    enableSound={false}
                    className="max-w-2xl"
                />

                <p className="mt-8 text-center text-sm text-gray-400">Everything you need to pass your capstone — no extra setup, no guesswork.</p>
            </div>
        </section>
    );
}
