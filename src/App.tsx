import { useEffect, useState } from 'react';
import { EffectCards } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-cards';
import { CardSwiper } from './components/CardSwiper';
import {
  type Category,
  type CategoryQuestion,
  categories,
  categoryQuestions,
} from './data/categoryQuestions';
import { otherGames } from './data/otherGames';
import { type Question, questions } from './data/questions';

type GameMode = 'random' | 'manual' | 'levelup' | 'category' | null;
type GameState = 'mode-select' | 'level-select' | 'category-select' | 'other-games' | 'playing';

function App() {
  const [gameState, setGameState] = useState<GameState>('mode-select');
  const [mode, setMode] = useState<GameMode>(null);
  const [selectedLevel, setSelectedLevel] = useState<1 | 2 | 3>(1);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | CategoryQuestion | null>(null);
  const [turnCount, setTurnCount] = useState(0);
  const [timeLimit, setTimeLimit] = useState<number | null>(10);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);

  const currentLevelQuestions = questions.filter((q) => q.level === selectedLevel);
  const currentCategoryQuestions = selectedCategory
    ? categoryQuestions.filter((q) => q.category === selectedCategory)
    : [];

  // カウントダウンタイマー
  useEffect(() => {
    if (remainingTime !== null && remainingTime > 0) {
      const timer = setTimeout(() => {
        setRemainingTime(remainingTime - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [remainingTime]);

  const handleModeSelect = (selectedMode: GameMode) => {
    setMode(selectedMode);
    if (selectedMode === 'levelup') {
      // レベルアップモードは自動的にレベル1から開始
      setSelectedLevel(1);
      setGameState('playing');
    } else if (selectedMode === 'category') {
      // カテゴリ選択モードはカテゴリ選択へ
      setGameState('category-select');
    } else {
      // ランダム・マニュアルモードはレベル選択へ
      setGameState('level-select');
    }
  };

  const handleLevelSelect = (level: 1 | 2 | 3) => {
    setSelectedLevel(level);
    setGameState('playing');
  };

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setGameState('playing');
  };

  const handleCardSelect = (question: Question | CategoryQuestion) => {
    setCurrentQuestion(question);
    // 制限時間ありの場合はタイマー開始
    if (timeLimit !== null) {
      setRemainingTime(timeLimit);
    }
  };

  const handleNextQuestion = () => {
    if (mode === 'levelup') {
      const newTurnCount = turnCount + 1;
      setTurnCount(newTurnCount);

      // レベルごとの必要問数: レベル1は4問、レベル2は6問、レベル3以降はずっとレベル3
      const requiredQuestions = selectedLevel === 1 ? 4 : selectedLevel === 2 ? 6 : 0;

      // 必要問数に達したらレベルアップ
      if (requiredQuestions > 0 && newTurnCount >= requiredQuestions && selectedLevel < 3) {
        setSelectedLevel((prev) => (prev + 1) as 1 | 2 | 3);
        setTurnCount(0);
      }
    }
    setCurrentQuestion(null);
    setRemainingTime(null);
  };

  const resetGame = () => {
    setGameState('mode-select');
    setMode(null);
    setSelectedLevel(1);
    setSelectedCategory(null);
    setTurnCount(0);
    setCurrentQuestion(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-pink-100 to-orange-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-8 pt-8">
          <h1
            className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2"
            style={{ fontFamily: "'Klee One', cursive" }}
          >
            レベルアップトーク
          </h1>
          <p className="text-gray-600 text-sm md:text-base">会話ゲーム</p>
        </div>

        {/* モード選択画面 */}
        {gameState === 'mode-select' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white/80 backdrop-blur rounded-3xl p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                モードを選んでね
              </h2>
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => handleModeSelect('levelup')}
                  className="w-full py-6 px-8 bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 text-white rounded-2xl font-bold text-lg shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl active:scale-95"
                >
                  🎯 レベルアップモード
                  <p className="text-sm font-normal mt-2 text-purple-100">
                    レベル1から始めて段階的に深い話へ
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => handleModeSelect('random')}
                  className="w-full py-6 px-8 bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white rounded-2xl font-bold text-lg shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl active:scale-95"
                >
                  🎯 レベル選択モード
                  <p className="text-sm font-normal mt-2 text-blue-100">
                    好きなレベルを選んで遊ぼう
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => handleModeSelect('manual')}
                  className="w-full py-6 px-8 bg-gradient-to-r from-pink-400 to-pink-600 hover:from-pink-500 hover:to-pink-700 text-white rounded-2xl font-bold text-lg shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl active:scale-95"
                >
                  👆 マニュアルモード
                  <p className="text-sm font-normal mt-2 text-pink-100">
                    カードをスワイプして自分で選ぶよ
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => handleModeSelect('category')}
                  className="w-full py-6 px-8 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white rounded-2xl font-bold text-lg shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl active:scale-95"
                >
                  📂 カテゴリ選択モード
                  <p className="text-sm font-normal mt-2 text-green-100">
                    カテゴリを選んで深掘りしよう
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setGameState('other-games')}
                  className="w-full py-6 px-8 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white rounded-2xl font-bold text-lg shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl active:scale-95"
                >
                  🎮 その他の会話ゲーム
                  <p className="text-sm font-normal mt-2 text-amber-100">
                    他のゲームのルールを見る
                  </p>
                </button>
              </div>
            </div>

            {/* ルール説明 */}
            <div className="bg-white/80 backdrop-blur rounded-3xl p-6 shadow-lg">
              <h3 className="font-bold text-lg mb-3 text-gray-800">📖 ルール</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✅ 質問を相手に投げかけて答えてもらおう</li>
                <li>✅ 答えられなかったらペナルティ（一気飲みなど）</li>
                <li>✅ 嘘は禁止の約束</li>
                <li>
                  ✅ レベルアップモードはレベル1を4問、レベル2を6問答えるとレベルアップ
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* レベル選択画面 */}
        {gameState === 'level-select' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white/80 backdrop-blur rounded-3xl p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                レベルを選んでね
              </h2>
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => handleLevelSelect(1)}
                  className="w-full py-6 px-8 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white rounded-2xl font-bold text-lg shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl active:scale-95"
                >
                  😊 レベル1 - アイスブレイク
                  <p className="text-sm font-normal mt-2 text-green-100">軽い質問で盛り上がろう</p>
                </button>
                <button
                  type="button"
                  onClick={() => handleLevelSelect(2)}
                  className="w-full py-6 px-8 bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white rounded-2xl font-bold text-lg shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl active:scale-95"
                >
                  🤔 レベル2 - 価値観
                  <p className="text-sm font-normal mt-2 text-orange-100">お互いの価値観を知ろう</p>
                </button>
                <button
                  type="button"
                  onClick={() => handleLevelSelect(3)}
                  className="w-full py-6 px-8 bg-gradient-to-r from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 text-white rounded-2xl font-bold text-lg shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl active:scale-95"
                >
                  🔥 レベル3 - 深い話
                  <p className="text-sm font-normal mt-2 text-red-100">
                    本音で語り合おう（下ネタ強め）
                  </p>
                </button>
              </div>
              <button
                type="button"
                onClick={() => setGameState('mode-select')}
                className="w-full mt-4 py-3 px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-medium transition-colors"
              >
                ← 戻る
              </button>
            </div>
          </div>
        )}

        {/* カテゴリ選択画面 */}
        {gameState === 'category-select' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white/80 backdrop-blur rounded-3xl p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                カテゴリを選んでね
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleCategorySelect(category)}
                    className="py-4 px-4 bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-500 hover:to-cyan-600 text-white rounded-xl font-bold text-sm shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
                  >
                    {category}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setGameState('mode-select')}
                className="w-full mt-6 py-3 px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-medium transition-colors"
              >
                ← 戻る
              </button>
            </div>
          </div>
        )}

        {/* その他の会話ゲーム紹介画面 */}
        {gameState === 'other-games' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white/80 backdrop-blur rounded-3xl p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                その他の会話ゲーム
              </h2>

              <div className="mb-8">
                <Swiper
                  effect={'cards'}
                  grabCursor={true}
                  modules={[EffectCards]}
                  className="w-full max-w-md h-[500px]"
                >
                  {otherGames.map((game) => (
                    <SwiperSlide key={game.id}>
                      <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-600 rounded-3xl shadow-2xl p-8 relative overflow-hidden">
                        <div className="h-full overflow-y-auto">
                          <h3 className="text-white text-2xl font-bold mb-4 text-center">
                            {game.title}
                          </h3>

                          <p className="text-white/90 text-base mb-6 text-center">
                            {game.description}
                          </p>

                          <div className="mb-6">
                            <h4 className="text-white font-bold text-lg mb-3">📖 ルール</h4>
                            <ul className="space-y-2">
                              {game.rules.map((rule) => (
                                <li key={rule} className="text-white/90 text-sm">
                                  ✓ {rule}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="text-white font-bold text-lg mb-3">💡 遊び方の例</h4>
                            <div className="space-y-1 text-white/90 text-sm">
                              {game.examples.map((example) => (
                                <p key={example}>{example}</p>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              <p className="text-center text-gray-600 mb-4 text-sm">
                カードをスワイプして他のゲームを見よう
              </p>

              <button
                type="button"
                onClick={() => setGameState('mode-select')}
                className="w-full py-3 px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-medium transition-colors"
              >
                ← 戻る
              </button>
            </div>
          </div>
        )}

        {/* ゲーム画面 */}
        {gameState === 'playing' && mode && (
          <div className="animate-fade-in">
            {mode === 'random' || mode === 'levelup' || mode === 'category' ? (
              // ランダム・レベルアップ・カテゴリモード: カード表示 + 次へボタン
              <div className="space-y-6">
                {currentQuestion ? (
                  <div className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-2xl">
                    <div className="text-center mb-6">
                      <div className="flex items-center justify-center gap-3 mb-4">
                        <span className="inline-block px-4 py-2 bg-purple-100 text-purple-600 rounded-full text-sm font-bold">
                          {mode === 'category' && 'category' in currentQuestion
                            ? currentQuestion.category
                            : `レベル ${'level' in currentQuestion ? currentQuestion.level : ''}`}
                        </span>
                        {timeLimit !== null && remainingTime !== null && (
                          <span
                            className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                              remainingTime <= 3
                                ? 'bg-red-100 text-red-600 animate-pulse'
                                : 'bg-blue-100 text-blue-600'
                            }`}
                          >
                            ⏱️ {remainingTime}秒
                          </span>
                        )}
                      </div>
                      <div className="w-full max-w-sm mx-auto mb-6">
                        <div className="bg-gradient-to-br from-pink-400 to-purple-600 rounded-3xl shadow-2xl p-8 relative overflow-hidden min-h-[300px] flex items-center justify-center">
                          <div className="absolute top-4 right-4 text-white/20 text-6xl font-bold">
                            {'level' in currentQuestion ? currentQuestion.level : '?'}
                          </div>
                          <p
                            className="text-white text-2xl font-bold text-center leading-relaxed transform -rotate-1"
                            style={{
                              fontFamily: "'Klee One', cursive",
                              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                            }}
                          >
                            {currentQuestion.text}
                          </p>
                          <div className="absolute bottom-4 left-4 text-white/50 text-sm">
                            #{currentQuestion.id}
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleNextQuestion}
                      className="w-full py-4 px-8 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white rounded-2xl font-bold text-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                      次の質問へ ▶
                    </button>

                    <div className="mt-4 p-4 bg-blue-50 rounded-xl">
                      <p className="text-sm text-gray-700 text-center">
                        {timeLimit !== null
                          ? '💡 時間内に答えられなかったら一気飲み！'
                          : '💡 相手が答えられなかったら一気飲み！'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={resetGame}
                      className="w-full mt-4 py-3 px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-medium transition-colors"
                    >
                      ゲームを終了
                    </button>
                  </div>
                ) : (
                  <div className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-2xl">
                    <div className="text-center mb-6">
                      <span className="inline-block px-4 py-2 bg-purple-100 text-purple-600 rounded-full text-sm font-bold">
                        {mode === 'category' ? selectedCategory : `レベル ${selectedLevel}`}
                      </span>
                    </div>

                    <CardSwiper
                      questions={
                        mode === 'category' ? currentCategoryQuestions : currentLevelQuestions
                      }
                      onCardSelect={handleCardSelect}
                      mode={mode}
                      timeLimit={timeLimit}
                      onTimeLimitChange={setTimeLimit}
                    />

                    <button
                      type="button"
                      onClick={resetGame}
                      className="w-full mt-6 py-3 px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-medium transition-colors"
                    >
                      ゲームを終了
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // マニュアルモード: カードスワイプのみ
              <div className="space-y-6">
                <div className="bg-white/90 backdrop-blur rounded-3xl p-6 shadow-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-4 py-2 bg-purple-100 text-purple-600 rounded-full text-sm font-bold">
                      レベル {selectedLevel}
                    </span>
                    <button
                      type="button"
                      onClick={resetGame}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium transition-colors"
                    >
                      終了
                    </button>
                  </div>

                  <CardSwiper
                    questions={currentLevelQuestions}
                    onCardSelect={handleCardSelect}
                    mode="manual"
                    timeLimit={timeLimit}
                    onTimeLimitChange={setTimeLimit}
                  />

                  <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                    <h3 className="font-bold text-gray-800 mb-2 text-center">遊び方</h3>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>👆 カードをスワイプして質問を選ぼう</li>
                      <li>💬 選んだ質問を相手にしてみよう</li>
                      <li>🍺 答えられなかったら一気飲み！</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Google Fonts読み込み */}
      <link
        href="https://fonts.googleapis.com/css2?family=Klee+One:wght@400;600&display=swap"
        rel="stylesheet"
      />

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

export default App;
