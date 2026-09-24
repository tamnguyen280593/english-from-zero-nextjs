'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './page.module.css';
import { useGameEngine, GameMode, Player } from '../../../hooks/useGameEngine';
import { useToast } from '../../../components/ui/Toast';
import type { PracticeQuestion } from '../../../types/lesson';

const AVATARS = ['🦁', '🦊', '🐰', '🐼', '🐸', '🦄', '🐯', '🐧'];

export default function GameArena() {
  const { gameState, availableTopics, availableCategories, startGame, nextTurn, resetGame } = useGameEngine();
  const { showToast } = useToast();
  const playerInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Setup State
  const [mode, setMode] = useState<GameMode>('single');
  const [players, setPlayers] = useState<Omit<Player, 'score' | 'streak'>[]>([
    { id: 'p1', name: '', avatar: '🦁' }
  ]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [timeLimit, setTimeLimit] = useState<number>(0);

  // Playing State
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);

  // Handle TTS
  const speakWord = (word: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStart = () => {
    const firstEmptyIndex = players.findIndex(p => !p.name.trim());
    if (firstEmptyIndex !== -1) {
      showToast('Vui lòng nhập tên cho tất cả người chơi!', 'error');
      // Scroll to and focus the first empty input
      const inputEl = playerInputRefs.current[firstEmptyIndex];
      if (inputEl) {
        inputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        inputEl.focus();
      }
      return;
    }
    const finalTopics = selectedTopics.length > 0 ? selectedTopics : availableTopics.map(t => t.slug);

    startGame({
      mode,
      players,
      selectedTopicSlugs: finalTopics,
      questionsPerPlayer: questionCount,
      timeLimit
    });
    if (timeLimit > 0) setTimeLeft(timeLimit);
  };

  const handleOptionSelect = (index: number) => {
    if (isAnswered || !gameState.currentQuestion) return;

    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === gameState.currentQuestion.correctAnswer;

    if (isCorrect && (gameState.currentQuestion as PracticeQuestion & { wordToSpeak?: string }).wordToSpeak) {
      speakWord((gameState.currentQuestion as PracticeQuestion & { wordToSpeak?: string }).wordToSpeak!);
    }
  };

  const handleTimeOut = useCallback(() => {
    if (isAnswered) return;
    setIsAnswered(true);
    setSelectedOption(-1); // -1 signifies timeout
  }, [isAnswered]);

  useEffect(() => {
    if (gameState.status !== 'playing' || timeLimit === 0 || isAnswered || !gameState.currentQuestion) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.status, timeLimit, isAnswered, gameState.currentQuestion, handleTimeOut]);

  const handleNextTurn = () => {
    if (!gameState.currentQuestion) return;
    const isCorrect = selectedOption === gameState.currentQuestion.correctAnswer;

    setSelectedOption(null);
    setIsAnswered(false);
    if (timeLimit > 0) setTimeLeft(timeLimit);
    nextTurn(isCorrect);
  };

  const renderSetup = () => (
    <div className={styles.setupCard}>
      <div className={styles.formGroup}>
        <label className={styles.label}>Chế độ chơi</label>
        <div className={styles.modeToggle}>
          <button
            className={mode === 'single' ? styles.modeBtnActive : styles.modeBtn}
            onClick={() => {
              setMode('single');
              setPlayers([{ id: 'p1', name: '', avatar: '🦁' }]);
            }}
          >
            👤 1 Người chơi
          </button>
          <button
            className={mode === 'multi' ? styles.modeBtnActive : styles.modeBtn}
            onClick={() => {
              setMode('multi');
              setPlayers([
                { id: 'p1', name: '', avatar: '🦁' },
                { id: 'p2', name: '', avatar: '🦊' }
              ]);
            }}
          >
            👥 Nhiều người chơi
          </button>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Người chơi</label>
        {players.map((p, idx) => (
          <div key={p.id} className={styles.playerInputGroup}>
            <select
              className={styles.avatarSelect}
              value={p.avatar}
              onChange={(e) => {
                const newP = [...players];
                newP[idx].avatar = e.target.value;
                setPlayers(newP);
              }}
            >
              {AVATARS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
            <input
              ref={(el) => { playerInputRefs.current[idx] = el; }}
              className={styles.input}
              placeholder={`Tên người chơi ${idx + 1}`}
              value={p.name}
              onChange={(e) => {
                const newP = [...players];
                newP[idx].name = e.target.value;
                setPlayers(newP);
              }}
            />
            {mode === 'multi' && players.length > 2 && (
              <button
                className={styles.removePlayerBtn}
                onClick={() => {
                  const newP = [...players];
                  newP.splice(idx, 1);
                  setPlayers(newP);
                }}
                title="Xóa người chơi"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        {mode === 'multi' && (
          <button
            className={styles.modeBtn}
            style={{ marginTop: '10px' }}
            onClick={() => setPlayers([...players, { id: `p${players.length + 1}`, name: '', avatar: AVATARS[players.length % AVATARS.length] }])}
          >
            + Thêm người chơi
          </button>
        )}
      </div>

      <div className={styles.inlineFormRow}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Số câu hỏi mỗi người</label>
          <select
            className={styles.inputSelect}
            value={questionCount}
            onChange={(e) => setQuestionCount(Number(e.target.value))}
          >
            <option value={5}>5 câu</option>
            <option value={10}>10 câu</option>
            <option value={20}>20 câu</option>
            <option value={50}>50 câu</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Thời gian trả lời (Time Attack)</label>
          <select
            className={styles.inputSelect}
            value={timeLimit}
            onChange={(e) => setTimeLimit(Number(e.target.value))}
          >
            <option value={0}>Không giới hạn</option>
            <option value={10}>10 giây / câu</option>
            <option value={15}>15 giây / câu</option>
            <option value={20}>20 giây / câu</option>
          </select>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>
          Chủ đề <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>(Bỏ trống để tự động chọn tất cả chủ đề)</span>
        </label>
        <div className={styles.categoriesContainer}>
          {availableCategories.map(cat => (
            <div key={cat.id} className={styles.categorySection}>
              <h3 className={styles.categoryTitle}>{cat.title}</h3>
              <div className={styles.topicsGrid}>
                {availableTopics.filter(t => t.categoryId === cat.id).map(topic => {
                  const isChecked = selectedTopics.includes(topic.slug);
                  return (
                    <label key={topic.id} className={`${styles.topicCheckboxLabel} ${isChecked ? styles.topicCheckboxLabelActive : ''}`}>
                      <input
                        type="checkbox"
                        className={styles.hiddenCheckbox}
                        checked={isChecked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTopics([...selectedTopics, topic.slug]);
                          } else {
                            setSelectedTopics(selectedTopics.filter(t => t !== topic.slug));
                          }
                        }}
                      />
                      <span className={styles.customCheckmark}></span>
                      {topic.title}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>



      <button className={styles.startBtn} onClick={handleStart}>
        🚀 BẮT ĐẦU GAME
      </button>
    </div>
  );

  const renderPlaying = () => {
    if (!gameState.currentQuestion) return null;
    const q = gameState.currentQuestion;
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];

    return (
      <div className={styles.gameBoard}>
        <button
          className={styles.quitBtn}
          onClick={() => setShowQuitConfirm(true)}
        >
          ✕ Thiết lập lại
        </button>

        <div className={styles.scoreBoard}>
          {gameState.players.map((p, i) => (
            <div key={p.id} className={`${styles.scoreItem} ${i === gameState.currentPlayerIndex ? styles.scoreItemActive : ''}`}>
              <span>{p.avatar}</span>
              <span>{p.name}: {p.score}</span>
              {p.streak >= 1 && <span className={styles.fire} title={`Chuỗi đúng: ${p.streak} câu`}>🔥</span>}
            </div>
          ))}
        </div>

        <div className={styles.turnIndicator}>
          <div className={styles.currentPlayer}>
            {currentPlayer.avatar} Lượt của {currentPlayer.name}
          </div>
          {timeLimit > 0 && (
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: timeLeft <= 5 ? '#ff7675' : 'var(--accent-primary)', marginTop: '8px' }}>
              ⏱ {timeLeft}s
            </div>
          )}
          <div className={styles.roundInfo}>
            Vòng {gameState.currentRound} / {gameState.totalRounds}
          </div>
        </div>

        <div className={styles.questionBox}>
          <div className={styles.questionText}>{q.question}</div>
          <div className={styles.optionsGrid}>
            {q.options.map((opt, idx) => {
              let btnClass = styles.optionBtn;
              if (isAnswered) {
                if (idx === q.correctAnswer) btnClass += ` ${styles.optionCorrect}`;
                else if (idx === selectedOption) btnClass += ` ${styles.optionWrong}`;
              }
              return (
                <button
                  key={idx}
                  className={btnClass}
                  onClick={() => handleOptionSelect(idx)}
                  disabled={isAnswered}
                >
                  <span className={styles.optionLetter}>{['A', 'B', 'C', 'D'][idx]}</span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>
        </div>

        {isAnswered && (
          <div className={styles.feedback}>
            {selectedOption === q.correctAnswer ? (
              <div className={styles.correctFeedback}>🎉 Chính xác! +10 điểm</div>
            ) : selectedOption === -1 ? (
              <div className={styles.wrongFeedback}>⏰ Hết giờ!</div>
            ) : (
              <div className={styles.wrongFeedback}>😢 Sai rồi!</div>
            )}
            <div className={styles.explanation}>{q.explanation}</div>
            <button className={styles.nextBtn} onClick={handleNextTurn}>
              Tiếp tục ➡️
            </button>
          </div>
        )}

        {showQuitConfirm && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h3>Thoát Game?</h3>
              <p>Bạn có chắc chắn muốn thoát game không? Mọi điểm số hiện tại sẽ bị hủy.</p>
              <div className={styles.modalActions}>
                <button className={styles.cancelBtn} onClick={() => setShowQuitConfirm(false)}>Hủy</button>
                <button className={styles.confirmBtn} onClick={() => {
                  setShowQuitConfirm(false);
                  resetGame();
                }}>Thoát</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderResults = () => {
    const sortedPlayers = [...gameState.players].sort((a, b) => b.score - a.score);
    const winner = sortedPlayers[0];

    return (
      <div className={styles.resultsBoard}>
        <div className={styles.trophy}>🏆</div>
        <div className={styles.winnerText}>
          {gameState.players.length > 1
            ? `Chúc mừng ${winner.name} đã chiến thắng!`
            : 'Hoàn thành chặng đường!'}
        </div>

        <div className={styles.leaderboard}>
          {sortedPlayers.map((p, idx) => (
            <div key={p.id} className={`${styles.rankItem} ${idx === 0 ? styles.rank1 : ''}`}>
              <div className={styles.rankPlayer}>
                <span>#{idx + 1}</span>
                <span>{p.avatar}</span>
                <span>{p.name}</span>
              </div>
              <div className={styles.rankScore}>
                {p.score} điểm
              </div>
            </div>
          ))}
        </div>

        <button className={styles.startBtn} onClick={resetGame}>
          🎮 Chơi ván mới
        </button>
      </div>
    );
  };

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Đấu Trường Tiếng Anh</h1>
        <p className={styles.subtitle}>Cùng nhau học từ vựng thật vui và hiệu quả!</p>
      </header>

      {gameState.status === 'setup' && renderSetup()}
      {gameState.status === 'playing' && renderPlaying()}
      {gameState.status === 'results' && renderResults()}
    </main>
  );
}
