import { useEffect, useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { EffectCards } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-cards';
import type { Question } from '../data/questions';
import type { CategoryQuestion } from '../data/categoryQuestions';

interface CardSwiperProps {
  questions: (Question | CategoryQuestion)[];
  onCardSelect: (question: Question | CategoryQuestion) => void;
  mode: 'random' | 'manual' | 'levelup' | 'category';
  timeLimit: number | null;
  onTimeLimitChange: (limit: number | null) => void;
}

export const CardSwiper = ({
  questions,
  onCardSelect,
  mode,
  timeLimit,
  onTimeLimitChange,
}: CardSwiperProps) => {
  const [shuffledQuestions, setShuffledQuestions] = useState<(Question | CategoryQuestion)[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);

  useEffect(() => {
    // Fisher-Yatesシャッフルアルゴリズム
    const shuffled = [...questions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setShuffledQuestions(shuffled);
  }, [questions]);

  const handleShowQuestion = () => {
    // ランダムモード用: シャッフルして質問を表示
    const shuffled = [...questions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setShuffledQuestions(shuffled);
    onCardSelect(shuffled[0]);
  };

  const handleShuffle = () => {
    setIsShuffling(true);

    // カードをシャッフルするアニメーション
    const shuffled = [...shuffledQuestions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    setTimeout(() => {
      setShuffledQuestions(shuffled);
      setIsShuffling(false);
    }, 1000);
  };

  const handleSlideChange = (swiper: SwiperType) => {
    if (mode === 'manual' && !isShuffling) {
      const currentQuestion = shuffledQuestions[swiper.activeIndex];
      if (currentQuestion) {
        onCardSelect(currentQuestion);
      }
    }
  };

  if (mode === 'random' || mode === 'levelup' || mode === 'category') {
    // ランダム・レベルアップ・カテゴリモード: お題を表示ボタンのみ
    return (
      <div className="w-full max-w-md mx-auto space-y-4">
        {/* 制限時間設定 */}
        <div className="bg-white/80 backdrop-blur rounded-xl p-4 shadow-md">
          <h3 className="text-sm font-bold text-gray-700 mb-3 text-center">⏱️ 制限時間設定</h3>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onTimeLimitChange(null)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all ${
                timeLimit === null
                  ? 'bg-gray-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              なし
            </button>
            <button
              type="button"
              onClick={() => onTimeLimitChange(5)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all ${
                timeLimit === 5
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              5秒
            </button>
            <button
              type="button"
              onClick={() => onTimeLimitChange(10)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all ${
                timeLimit === 10
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              10秒
            </button>
            <button
              type="button"
              onClick={() => onTimeLimitChange(15)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all ${
                timeLimit === 15
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              15秒
            </button>
          </div>
        </div>

        {/* お題を表示ボタン */}
        <button
          type="button"
          onClick={handleShowQuestion}
          className="w-full py-6 px-8 rounded-2xl font-bold text-xl shadow-lg transition-all duration-300 transform bg-gradient-to-r from-yellow-400 to-orange-500 hover:scale-105 hover:shadow-2xl active:scale-95 text-white"
        >
          🎲 お題を表示
        </button>
      </div>
    );
  }

  // マニュアルモード: カードスワイプ
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-8">
        <Swiper
          effect={'cards'}
          grabCursor={true}
          modules={[EffectCards]}
          className="w-72 h-96"
          onSlideChange={handleSlideChange}
          allowTouchMove={true}
        >
          {shuffledQuestions.map((question) => (
            <SwiperSlide key={question.id}>
              <div className="w-full h-full bg-gradient-to-br from-pink-400 to-purple-600 rounded-3xl shadow-2xl flex items-center justify-center p-8 relative overflow-hidden">
                {/* 手書き風の装飾 */}
                <div className="absolute top-4 right-4 text-white/20 text-6xl font-bold">
                  {question.level}
                </div>

                {/* 質問テキスト */}
                <p
                  className="text-white text-2xl font-bold text-center leading-relaxed transform -rotate-1"
                  style={{
                    fontFamily: "'Klee One', cursive",
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                  }}
                >
                  {question.text}
                </p>

                {/* カード番号 */}
                <div className="absolute bottom-4 left-4 text-white/50 text-sm">#{question.id}</div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <button
        type="button"
        onClick={handleShuffle}
        disabled={isShuffling}
        className={`w-full py-4 px-8 rounded-2xl font-bold text-lg shadow-lg transition-all duration-300 transform ${
          isShuffling
            ? 'bg-gray-400 cursor-not-allowed scale-95'
            : 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:scale-105 hover:shadow-2xl active:scale-95'
        } text-white`}
      >
        {isShuffling ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <title>読み込み中</title>
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            シャッフル中...
          </span>
        ) : (
          '🎴 カードをシャッフル'
        )}
      </button>

      <p className="text-center text-gray-600 mt-4 text-sm">カードをスワイプして選んでね</p>
    </div>
  );
};
