// React and hooks are available globally via CDN in index.html
const { useState, useEffect, useCallback } = React;

// Helper components defined as window properties to ensure they are available to each other
window.ProgressTimer = ({ duration, color, onComplete }) => {
  const COLORS = window.COLORS;
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { clearInterval(interval); onComplete?.(); return 100; }
        return prev + (100 / (duration / 50));
      });
    }, 50);
    return () => clearInterval(interval);
  }, [duration, onComplete]);
  return (
    <div style={{ height: '3px', background: COLORS.bgLight, borderRadius: '2px', overflow: 'hidden', marginTop: '16px' }}>
      <div style={{ height: '100%', width: `${progress}%`, background: color || COLORS.highlight, transition: 'width 50ms linear' }} />
    </div>
  );
};

window.CandidateCard = ({ candidate, selected, onSelect, showRisks, selectedRisks, onRiskToggle, compact }) => {
  const COLORS = window.COLORS;
  const RISK_FLAGS = window.RISK_FLAGS;
  const matchColor = candidate.match >= 80 ? COLORS.success : candidate.match >= 60 ? '#F59E0B' : COLORS.warning;
  return (
    <div onClick={() => !showRisks && onSelect?.(candidate.id)} style={{ background: selected ? COLORS.highlightSoft : COLORS.bgCard, border: `2px solid ${selected ? COLORS.highlight : 'transparent'}`, borderRadius: '12px', padding: compact ? '12px' : '16px', cursor: showRisks ? 'default' : 'pointer', transition: 'all 0.2s ease', marginBottom: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <span style={{ fontWeight: 600, fontSize: '15px', color: COLORS.text }}>{candidate.name}</span>
            {selected && !showRisks && <span style={{ background: COLORS.highlight, color: COLORS.text, fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px' }}>SELECTED</span>}
          </div>
          <div style={{ fontSize: '13px', color: COLORS.textMuted, marginBottom: '6px' }}>{candidate.role} · {candidate.company}</div>
        </div>
        {candidate.match && <div style={{ background: `${matchColor}20`, color: matchColor, fontWeight: 700, fontSize: '14px', padding: '6px 10px', borderRadius: '8px', minWidth: '48px', textAlign: 'center' }}>{candidate.match}%</div>}
      </div>
      {showRisks && <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>{RISK_FLAGS.map(flag => { const isSelected = selectedRisks[candidate.id]?.includes(flag.id); return <button key={flag.id} onClick={() => onRiskToggle(candidate.id, flag.id)} style={{ background: isSelected ? COLORS.warningBg : COLORS.bgLight, border: `1px solid ${isSelected ? COLORS.warning : 'transparent'}`, color: isSelected ? COLORS.warning : COLORS.textMuted, fontSize: '11px', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', transition: 'all 0.15s ease' }}><span>{flag.icon}</span>{flag.label}</button>; })}</div>}
    </div>
  );
};

window.EmailPreview = ({ from, subject, body, isReply, critical }) => {
  const COLORS = window.COLORS;
  return (
    <div style={{ background: COLORS.bgCard, borderRadius: '12px', overflow: 'hidden', border: critical ? `1px solid ${COLORS.warning}` : 'none', marginBottom: '20px' }}>
      <div style={{ background: critical ? COLORS.warningBg : COLORS.bgLight, padding: '12px 16px', borderBottom: `1px solid ${COLORS.bg}` }}>
        <div style={{ fontSize: '11px', color: COLORS.textDim, marginBottom: '4px' }}>{isReply ? 'RE: ' : 'FROM: '}{from}</div>
        <div style={{ fontSize: '14px', fontWeight: 600, color: COLORS.text }}>{subject}</div>
      </div>
      <div style={{ padding: '16px', fontSize: '13px', color: COLORS.textMuted, lineHeight: 1.6 }}>{body}</div>
    </div>
  );
};

window.OptionButton = ({ label, selected, onClick, disabled }) => {
  const COLORS = window.COLORS;
  return (
    <button onClick={onClick} disabled={disabled} style={{ width: '100%', padding: '16px 18px', background: selected ? COLORS.highlightSoft : COLORS.bgCard, border: `2px solid ${selected ? COLORS.highlight : 'transparent'}`, borderRadius: '12px', cursor: disabled ? 'not-allowed' : 'pointer', textAlign: 'left', marginBottom: '10px', transition: 'all 0.15s ease', opacity: disabled ? 0.5 : 1 }}>
      <span style={{ fontSize: '14px', color: COLORS.text, lineHeight: 1.5 }}>{label}</span>
    </button>
  );
};

window.FeedbackPanel = ({ type, message, points, outcomes, onComplete }) => {
  const COLORS = window.COLORS;
  const ProgressTimer = window.ProgressTimer;
  const isPositive = type === 'correct';
  const isPartial = type === 'partial';

  // Determine the specific outcome text based on the type
  let outcomeText = null;
  if (outcomes) {
    if (isPositive) outcomeText = outcomes.correct;
    else if (isPartial) outcomeText = outcomes.partially_correct;
    else outcomeText = outcomes.incorrect;
  }

  // Calculate total reading length for duration
  const totalLength = (outcomeText ? outcomeText.length : 0) + (message ? message.length : 0);
  // Base duration of 2.5s + 50ms per character
  const duration = Math.max(2500, totalLength * 50);

  return (
    <div style={{ background: isPositive ? COLORS.successBg : isPartial ? COLORS.highlightSoft : COLORS.warningBg, borderRadius: '12px', padding: '16px', borderLeft: `4px solid ${isPositive ? COLORS.success : isPartial ? COLORS.highlight : COLORS.warning}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{ fontSize: '14px', color: isPositive ? COLORS.success : isPartial ? COLORS.highlight : COLORS.warning, fontWeight: 600 }}>{isPositive ? '✓ Strong choice' : isPartial ? '◐ Acceptable, But Try Again' : '✗ Risky approach, Try Again'}</div>
        <div style={{ fontSize: '14px', fontWeight: 700, color: isPositive ? COLORS.success : isPartial ? COLORS.highlight : COLORS.textMuted }}>{points > 0 ? `+${points} Skillions` : ''}</div>
      </div>

      {outcomeText && (
        <div style={{ marginBottom: '0px' }}>
          <div style={{ fontSize: '14px', color: COLORS.text, fontWeight: 300, lineHeight: 1.4 }}>{outcomeText}</div>
        </div>
      )}


      <ProgressTimer
        duration={duration}
        color={isPositive ? COLORS.success : isPartial ? COLORS.highlight : COLORS.warning}
        onComplete={onComplete}
      />
    </div>
  );
};

window.TradeOffMeters = function ({ meters, onComplete }) {
  const COLORS = window.COLORS;
  const { useState } = React;
  const [values, setValues] = useState(meters.map(m => m.initial || 50));
  const handleChange = (idx, val) => {
    const newValues = [...values];
    newValues[idx] = parseInt(val);
    setValues(newValues);
  };
  return (
    <div style={{ background: COLORS.bgCard, borderRadius: '16px', padding: '20px', marginBottom: '20px' }}>
      {meters.map((m, i) => (
        <div key={i} style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: COLORS.textMuted }}>{m.label}</span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: COLORS.highlight }}>{values[i]}%</span>
          </div>
          <input type="range" min="0" max="100" value={values[i]} onChange={(e) => handleChange(i, e.target.value)} style={{ width: '100%', accentColor: COLORS.highlight, cursor: 'pointer' }} />
        </div>
      ))}
      <div style={{ position: 'sticky', bottom: 0, padding: '16px 0 20px 0', background: COLORS.bg, zIndex: 10, marginTop: 'auto' }}>
        <button id="tradeoff-confirm" onClick={() => onComplete(values)} style={{ width: '100%', padding: '16px', background: COLORS.cta, border: 'none', borderRadius: '14px', color: '#0D2436', fontWeight: 600, boxShadow: '0 4px 12px rgba(127, 194, 65, 0.3)' }}>Finalise Trade-offs</button>
      </div>
    </div>
  );
};

window.RationaleBuilder = function ({ pool, minSelection = 3, maxSelection = 5, onComplete }) {
  const COLORS = window.COLORS;
  const { useState } = React;
  const [selected, setSelected] = useState([]);
  const toggle = (idx) => {
    const isSelected = selected.includes(idx);
    if (isSelected) setSelected(selected.filter(i => i !== idx));
    else if (selected.length < maxSelection) setSelected([...selected, idx]);
  };
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ fontSize: '11px', color: COLORS.textDim, marginBottom: '12px', textTransform: 'uppercase' }}>Selected {selected.length}/{maxSelection} rationale lines</div>
      <div style={{ background: COLORS.bgCard, borderRadius: '16px', padding: '8px', marginBottom: '16px', border: `1px solid ${COLORS.bgLight}` }}>
        {selected.length === 0 && <div style={{ padding: '16px', color: COLORS.textDim, fontSize: '13px', fontStyle: 'italic' }}>Select lines to build your rationale...</div>}
        {selected.map(idx => (
          <div key={idx} onClick={() => toggle(idx)} style={{ padding: '12px 14px', background: COLORS.highlightSoft, borderRadius: '8px', marginBottom: '6px', fontSize: '13px', color: COLORS.text, borderLeft: `3px solid ${COLORS.highlight}`, cursor: 'pointer' }}>{pool[idx]}</div>
        ))}
      </div>
      <div style={{ maxHeight: '200px', overflowY: 'auto', paddingRight: '12px' }}>
        {pool.map((line, i) => !selected.includes(i) && (
          <div key={i} onClick={() => toggle(i)} style={{ padding: '12px 14px', background: COLORS.bgLight, borderRadius: '10px', marginBottom: '8px', fontSize: '13px', color: COLORS.textMuted, cursor: 'pointer', opacity: selected.length >= maxSelection ? 0.5 : 1 }}>{line}</div>
        ))}
      </div>
      {selected.length >= minSelection && (
        <div style={{ position: 'sticky', bottom: 0, padding: '16px 0 20px 0', background: COLORS.bg, zIndex: 10, marginTop: 'auto' }}>
          <button id="rationale-confirm" onClick={() => onComplete(selected)} style={{ width: '100%', padding: '16px', background: COLORS.cta, border: 'none', borderRadius: '14px', color: '#0D2436', fontWeight: 600, boxShadow: '0 4px 12px rgba(127, 194, 65, 0.3)' }}>Send Rationale</button>
        </div>
      )}
    </div>
  );
};

window.ChatMessage = function ({ messages }) {
  const COLORS = window.COLORS;
  return (
    <div style={{ background: COLORS.bgCard, borderRadius: '16px', padding: '16px', marginBottom: '20px', border: `1px solid ${COLORS.bgLight}` }}>
      {messages.map((m, i) => (
        <div key={i} style={{ marginBottom: '14px', display: 'flex', flexDirection: m.isSystem ? 'column' : 'row', alignItems: m.isSystem ? 'center' : 'flex-start', gap: '10px' }}>
          {!m.isSystem && <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: m.isMe ? COLORS.highlight : COLORS.bgLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>{m.sender[0]}</div>}
          <div style={{ flex: 1, textAlign: m.isSystem ? 'center' : 'left' }}>
            {!m.isSystem && <div style={{ fontSize: '10px', color: COLORS.textDim, marginBottom: '2px' }}>{m.sender}</div>}
            <div style={{ background: m.isSystem ? 'transparent' : m.isMe ? COLORS.highlightSoft : COLORS.bgLight, padding: m.isSystem ? '4px 0' : '10px 14px', borderRadius: '12px', fontSize: m.isSystem ? '11px' : '13px', color: m.isSystem ? COLORS.textDim : COLORS.text, border: m.isMe ? `1px solid ${COLORS.highlight}` : 'none' }}>{m.text}</div>
          </div>
        </div>
      ))}
    </div>
  );
};


window.ChatResponseSelector = ({ incomingMessage, options, onSelect }) => {
  const COLORS = window.COLORS;
  return (
    <div style={{ background: COLORS.bgCard, borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ alignSelf: 'flex-start', background: COLORS.bgLight, color: COLORS.text, padding: '12px 16px', borderRadius: '12px 12px 12px 0', maxWidth: '85%', fontSize: '14px', lineHeight: 1.5 }}>
        <div style={{ fontSize: '11px', color: COLORS.highlight, marginBottom: '4px', fontWeight: 600 }}>MANAGER</div>
        {incomingMessage}
      </div>
      <div style={{ fontSize: '12px', color: COLORS.textDim, textAlign: 'center', margin: '8px 0' }}>Choose your reply:</div>
      {options.map((opt, i) => (
        <div key={i} onClick={() => onSelect(i)} style={{ alignSelf: 'flex-end', background: COLORS.cta, color: '#0D2436', padding: '12px 16px', borderRadius: '12px 12px 0 12px', maxWidth: '85%', fontSize: '14px', fontWeight: 500, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.2)', transition: 'transform 0.1s active' }}>
          {opt}
        </div>
      ))}
    </div>
  );
};

window.TimelineVisualizer = ({ options, onSelect }) => {
  const COLORS = window.COLORS;
  return (
    <div style={{ background: COLORS.bgCard, borderRadius: '16px', padding: '20px' }}>
      <div style={{ fontSize: '12px', color: COLORS.textMuted, marginBottom: '16px', textAlign: 'center' }}>PROJECTED CLOSURE TIMELINE</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '14px', left: '10%', right: '10%', height: '2px', background: COLORS.bgLight, zIndex: 0 }}></div>
        {['Today', 'Wed', 'Fri', 'Next Mon'].map((d, i) => (
          <div key={i} style={{ zIndex: 1, textAlign: 'center' }}>
            <div style={{ width: '28px', height: '28px', background: i === 2 ? COLORS.highlight : COLORS.bgLight, borderRadius: '50%', color: i === 2 ? '#FFF' : COLORS.textDim, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, margin: '0 auto 8px' }}>{i + 1}</div>
            <div style={{ fontSize: '11px', color: COLORS.textDim }}>{d}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {options.map((opt, i) => (
          <button key={i} onClick={() => onSelect(i)} style={{ background: 'transparent', border: `1px solid ${COLORS.bgLight}`, borderRadius: '12px', padding: '16px', color: COLORS.text, textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '18px' }}>🔧</span>
            <span style={{ fontSize: '13px', lineHeight: 1.4 }}>Fix bottleneck: <strong>{opt}</strong></span>
          </button>
        ))}
      </div>
    </div>
  );
};

window.VideoCallProfile = ({ options, onSelect }) => {
  const COLORS = window.COLORS;
  return (
    <div style={{ background: COLORS.bgCard, borderRadius: '16px', overflow: 'hidden' }}>
      <div style={{ height: '140px', background: 'linear-gradient(135deg, #2C3E50, #000)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', position: 'relative' }}>
        <div style={{ width: '60px', height: '60px', background: COLORS.highlight, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', border: '3px solid #FFF' }}>👤</div>
        <div style={{ marginTop: '10px', color: '#e4e4e4ff', fontWeight: 600, fontSize: '14px' }}>Hiring Manager</div>
        <div style={{ fontSize: '11px', color: '#4ADE80', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}><div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ADE80' }}></div> Speaking...</div>
        <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: '4px', fontSize: '10px' }}>HQ LIVE</div>
      </div>
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ fontSize: '11px', color: COLORS.textDim, marginBottom: '4px' }}>YOUR RESPONSE</div>
        {options.map((opt, i) => (
          <button key={i} onClick={() => onSelect(i)} style={{ width: '100%', padding: '14px', background: COLORS.bgLight, border: 'none', borderRadius: '10px', color: COLORS.text, fontSize: '13px', textAlign: 'left', cursor: 'pointer' }}>{opt}</button>
        ))}
      </div>
    </div>
  );
};

window.CandidateComparisonTable = ({ options, onSelect }) => {
  const COLORS = window.COLORS;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ background: COLORS.bgCard, borderRadius: '12px', padding: '12px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: COLORS.text }}>Candidate A</div>
            <div style={{ fontSize: '10px', color: COLORS.highlight, marginTop: '2px' }}>High Potential</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: COLORS.text }}>Candidate B</div>
            <div style={{ fontSize: '10px', color: COLORS.success, marginTop: '2px' }}>Safe Bet</div>
          </div>
        </div>
        <div style={{ background: COLORS.bg, borderRadius: '8px', padding: '10px', fontSize: '11px', color: COLORS.textMuted, lineHeight: 1.5 }}>
          A has <strong>better strategic answers</strong> but has switched jobs frequently. B has <strong>perfect industry tenure</strong> but struggled with the case study.
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {options.map((opt, i) => (
          <button key={i} onClick={() => onSelect(i)} style={{ padding: '14px', background: '#253341', border: `1px solid ${COLORS.bgLight}`, borderRadius: '10px', color: COLORS.text, fontSize: '13px', textAlign: 'left', cursor: 'pointer' }}>{opt}</button>
        ))}
      </div>
    </div>
  );
};

window.ChatResponseSelector = ({ incomingMessage, options, onSelect }) => {
  const COLORS = window.COLORS;
  return (
    <div style={{ background: COLORS.bgCard, borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ alignSelf: 'flex-start', background: COLORS.bgLight, color: COLORS.text, padding: '12px 16px', borderRadius: '12px 12px 12px 0', maxWidth: '85%', fontSize: '14px', lineHeight: 1.5 }}>
        <div style={{ fontSize: '11px', color: COLORS.highlight, marginBottom: '4px', fontWeight: 600 }}>MANAGER</div>
        {incomingMessage}
      </div>
      <div style={{ fontSize: '12px', color: COLORS.textDim, textAlign: 'center', margin: '8px 0' }}>Choose your reply:</div>
      {options.map((opt, i) => (
        <div key={i} onClick={() => onSelect(i)} style={{ alignSelf: 'flex-end', background: COLORS.cta, color: '#0D2436', padding: '12px 16px', borderRadius: '12px 12px 0 12px', maxWidth: '85%', fontSize: '14px', fontWeight: 500, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.2)', transition: 'transform 0.1s active' }}>
          {opt}
        </div>
      ))}
    </div>
  );
};

window.TimelineVisualizer = ({ options, onSelect }) => {
  const COLORS = window.COLORS;
  return (
    <div style={{ background: COLORS.bgCard, borderRadius: '16px', padding: '20px' }}>
      <div style={{ fontSize: '12px', color: COLORS.textMuted, marginBottom: '16px', textAlign: 'center' }}>PROJECTED CLOSURE TIMELINE</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '14px', left: '10%', right: '10%', height: '2px', background: COLORS.bgLight, zIndex: 0 }}></div>
        {['Today', 'Wed', 'Fri', 'Next Mon'].map((d, i) => (
          <div key={i} style={{ zIndex: 1, textAlign: 'center' }}>
            <div style={{ width: '28px', height: '28px', background: i === 2 ? COLORS.highlight : COLORS.bgLight, borderRadius: '50%', color: i === 2 ? '#FFF' : COLORS.textDim, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, margin: '0 auto 8px' }}>{i + 1}</div>
            <div style={{ fontSize: '11px', color: COLORS.textDim }}>{d}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {options.map((opt, i) => (
          <button key={i} onClick={() => onSelect(i)} style={{ background: 'transparent', border: `1px solid ${COLORS.bgLight}`, borderRadius: '12px', padding: '16px', color: COLORS.text, textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '18px' }}>🔧</span>
            <span style={{ fontSize: '13px', lineHeight: 1.4 }}>Fix bottleneck: <strong>{opt}</strong></span>
          </button>
        ))}
      </div>
    </div>
  );
};

window.VideoCallProfile = ({ options, onSelect }) => {
  const COLORS = window.COLORS;
  return (
    <div style={{ background: COLORS.bgCard, borderRadius: '16px', overflow: 'hidden' }}>
      <div style={{ height: '140px', background: 'linear-gradient(135deg, #2C3E50, #000)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', position: 'relative' }}>
        <div style={{ width: '60px', height: '60px', background: COLORS.highlight, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', border: '3px solid #FFF' }}>👤</div>
        <div style={{ marginTop: '10px', color: '#e1e1e1ff', fontWeight: 600, fontSize: '14px' }}>Hiring Manager</div>
        <div style={{ fontSize: '11px', color: '#4ADE80', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}><div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ADE80' }}></div> Speaking...</div>
        <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: '4px', fontSize: '10px' }}>HQ LIVE</div>
      </div>
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ fontSize: '11px', color: COLORS.textDim, marginBottom: '4px' }}>YOUR RESPONSE</div>
        {options.map((opt, i) => (
          <button key={i} onClick={() => onSelect(i)} style={{ width: '100%', padding: '14px', background: COLORS.bgLight, border: 'none', borderRadius: '10px', color: COLORS.text, fontSize: '13px', textAlign: 'left', cursor: 'pointer' }}>{opt}</button>
        ))}
      </div>
    </div>
  );
};

window.CandidateComparisonTable = ({ options, onSelect }) => {
  const COLORS = window.COLORS;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ background: COLORS.bgCard, borderRadius: '12px', padding: '12px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: COLORS.text }}>Candidate A</div>
            <div style={{ fontSize: '10px', color: COLORS.highlight, marginTop: '2px' }}>High Potential</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: COLORS.text }}>Candidate B</div>
            <div style={{ fontSize: '10px', color: COLORS.success, marginTop: '2px' }}>Safe Bet</div>
          </div>
        </div>
        <div style={{ background: COLORS.bg, borderRadius: '8px', padding: '10px', fontSize: '11px', color: COLORS.textMuted, lineHeight: 1.5 }}>
          A has <strong>better strategic answers</strong> but has switched jobs frequently. B has <strong>perfect industry tenure</strong> but struggled with the case study.
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {options.map((opt, i) => (
          <button key={i} onClick={() => onSelect(i)} style={{ padding: '14px', background: '#253341', border: `1px solid ${COLORS.bgLight}`, borderRadius: '10px', color: COLORS.text, fontSize: '13px', textAlign: 'left', cursor: 'pointer' }}>{opt}</button>
        ))}
      </div>
    </div>
  );
};

window.ApprovalNoteBuilder = ({ options, onSelect }) => {
  const COLORS = window.COLORS;
  const { useState } = React;
  const [selected, setSelected] = useState(null);

  return (
    <div style={{ background: COLORS.bgCard, borderRadius: '16px', padding: '20px', border: `1px solid ${COLORS.bgLight}` }}>
      <div style={{ marginBottom: '16px', borderBottom: `1px solid ${COLORS.bgLight}`, paddingBottom: '12px' }}>
        <div style={{ fontSize: '11px', color: COLORS.textDim }}>TO: FOUNDER@COMPANY.COM</div>
        <div style={{ fontSize: '14px', fontWeight: 600, color: COLORS.text, marginTop: '4px' }}>SUBJECT: VP Hire - Approval Required</div>
      </div>

      <div style={{ minHeight: '120px', background: COLORS.bg, borderRadius: '8px', padding: '16px', marginBottom: '16px', color: COLORS.text, fontSize: '14px', lineHeight: 1.6, fontFamily: 'monospace' }}>
        {selected !== null ? options[selected] : <span style={{ color: COLORS.textDim, fontStyle: 'italic' }}>[Select a drafting option below to preview message...]</span>}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {options.map((opt, i) => (
          <button key={i} onClick={() => setSelected(i)} style={{ padding: '12px', background: selected === i ? COLORS.highlightSoft : COLORS.bgLight, border: `1px solid ${selected === i ? COLORS.highlight : 'transparent'}`, borderRadius: '8px', textAlign: 'left', color: COLORS.text, fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s' }}>
            <span style={{ fontWeight: 600, color: selected === i ? COLORS.highlight : COLORS.textDim }}>{String.fromCharCode(65 + i)}:</span> {opt.split(';')[0]}...
          </button>
        ))}
      </div>

      <div style={{ marginTop: '20px' }}>
        <button disabled={selected === null} onClick={() => onSelect(selected)} style={{ width: '100%', padding: '14px', background: selected !== null ? COLORS.cta : COLORS.bgLight, color: selected !== null ? '#0D2436' : COLORS.textDim, border: 'none', borderRadius: '10px', fontWeight: 600, cursor: selected !== null ? 'pointer' : 'not-allowed', boxShadow: selected !== null ? '0 4px 12px rgba(127, 194, 65, 0.3)' : 'none' }}>
          Send Note
        </button>
      </div>
    </div>
  );
};

window.MemoStructureBuilder = ({ options, onSelect }) => {
  const COLORS = window.COLORS;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {options.map((opt, i) => (
          <button key={i} onClick={() => onSelect(i)} style={{ padding: '16px', background: COLORS.bgCard, border: `1px solid ${COLORS.bgLight}`, borderRadius: '12px', textAlign: 'left', color: COLORS.text, fontSize: '13px', cursor: 'pointer', lineHeight: 1.4, transition: 'all 0.2s hover' }}>
            <div style={{ fontSize: '10px', color: COLORS.highlight, marginBottom: '6px', textTransform: 'uppercase', fontWeight: 700 }}>Structure Option {i + 1}</div>
            {opt}
          </button>
        ))}
      </div>
      <div style={{ background: '#FFF', borderRadius: '4px', padding: '20px', height: '320px', opacity: 0.9, boxShadow: '0 4px 20px rgba(0,0,0,0.2)', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 10, right: 10, fontSize: '10px', color: '#999' }}>PREVIEW</div>
        <div style={{ width: '40%', height: '8px', background: '#94A3B8', marginBottom: '20px' }}></div>
        <div style={{ width: '100%', height: '4px', background: '#E2E8F0', marginBottom: '8px' }}></div>
        <div style={{ width: '90%', height: '4px', background: '#E2E8F0', marginBottom: '8px' }}></div>
        <div style={{ width: '95%', height: '4px', background: '#E2E8F0', marginBottom: '24px' }}></div>

        <div style={{ width: '30%', height: '8px', background: '#94A3B8', marginBottom: '16px' }}></div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1, height: '80px', background: '#F1F5F9', borderRadius: '4px' }}></div>
          <div style={{ flex: 1, height: '80px', background: '#F1F5F9', borderRadius: '4px' }}></div>
        </div>
      </div>
    </div>
  );
};

window.ClosureProofPacket = ({ options, onSelect }) => {
  const COLORS = window.COLORS;
  return (
    <div style={{ background: COLORS.bgCard, borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>💼</div>
      <div style={{ fontSize: '18px', fontWeight: 600, color: COLORS.text, marginBottom: '8px' }}>Assemble Hiring Closure Proof</div>
      <div style={{ fontSize: '14px', color: COLORS.textMuted, marginBottom: '24px', maxWidth: '80%', margin: '0 auto 24px' }}>Select the most robust evidence package to lock in your certification.</div>

      <div style={{ display: 'grid', gap: '12px' }}>
        {options.map((opt, i) => (
          <button key={i} onClick={() => onSelect(i)} style={{ padding: '16px 20px', background: COLORS.bgLight, border: '2px solid transparent', borderRadius: '12px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', transition: 'all 0.2s' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: COLORS.bg, border: `2px solid ${COLORS.textDim}`, flexShrink: 0, display: 'grid', placeItems: 'center' }}></div>
            <span style={{ fontSize: '14px', color: COLORS.text, lineHeight: 1.4, fontWeight: 500 }}>{opt}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

window.downloadBadge = (badgeTitle) => {
  const canvas = document.createElement('canvas');
  const size = 600;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Background - Dark Premium Hexagon
  ctx.fillStyle = '#0D2436';
  ctx.fillRect(0, 0, size, size);

  // Hexagon Shape
  const hexRadius = 240;
  const centerX = size / 2;
  const centerY = size / 2;

  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle_deg = 60 * i - 30;
    const angle_rad = Math.PI / 180 * angle_deg;
    const x = centerX + hexRadius * Math.cos(angle_rad);
    const y = centerY + hexRadius * Math.sin(angle_rad);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();

  // Gradient Fill
  const gradient = ctx.createLinearGradient(centerX - hexRadius, centerY - hexRadius, centerX + hexRadius, centerY + hexRadius);
  gradient.addColorStop(0, '#1A3A52');
  gradient.addColorStop(1, '#091620');
  ctx.fillStyle = gradient;
  ctx.fill();

  // Border
  ctx.lineWidth = 15;
  ctx.strokeStyle = '#7FC241'; // COLORS.cta
  ctx.stroke();

  // Text Styling
  ctx.textAlign = 'center';
  ctx.fillStyle = '#FFFFFF';

  // Badge Title - Text Wrap (Fixed Font Size)
  ctx.font = 'bold 48px system-ui, -apple-system, sans-serif';
  const maxWidth = 380;
  const lineHeight = 55;
  const words = badgeTitle.split(' ');
  let lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    let testLine = currentLine + ' ' + words[i];
    let metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth) {
      lines.push(currentLine);
      currentLine = words[i];
    } else {
      currentLine = testLine;
    }
  }
  lines.push(currentLine);

  // Center the block vertically around centerY - 20
  let startY = (centerY - 20) - ((lines.length - 1) * lineHeight) / 2;

  lines.forEach((line, index) => {
    ctx.fillText(line, centerX, startY + (index * lineHeight));
  });

  // Subtitle
  ctx.font = '300 24px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#8BA3B9'; // textMuted
  ctx.fillText('HR Manager Job Simulation', centerX, centerY + 50);

  // Footer
  ctx.font = '600 20px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#7FC241'; // cta
  ctx.fillText('LearnTube 2026', centerX, centerY + 130);

  // Open in New Tab
  window.trackEvent('badge_shared', { badge: badgeTitle });
  const newWindow = window.open('', '_blank');
  if (newWindow) {
    newWindow.document.write('<html><head><title>' + (badgeTitle || 'Badge') + '</title></head><body style="margin:0; background:#091620; display:flex; align-items:center; justify-content:center; height:100vh;"></body></html>');

    canvas.toBlob((blob) => {
      if (!blob) {
        console.error('Badge generation failed');
        newWindow.close();
        return;
      }
      const url = URL.createObjectURL(blob);
      const img = newWindow.document.createElement('img');
      img.src = url;
      img.style.maxWidth = '100%';
      img.style.boxShadow = '0 10px 40px rgba(0,0,0,0.5)';
      img.style.borderRadius = '20px'; // Rounded slightly to match feel
      newWindow.document.body.appendChild(img);

      // Cleanup URL revocation on window unload? Browser handles mostly, but good practice
    }, 'image/png');
  } else {
    alert('Please allow popups to view your badge.');
  }
};

window.SimulationResult = ({ simulation, score, onContinue, nextSimTitle }) => {
  const COLORS = window.COLORS;
  const metadata = simulation.simulation_metadata;
  const deliverables = metadata.deliverables_unlockable || {};

  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(180deg, ${COLORS.bg} 0%, #091620 100%)`, padding: '24px 20px', fontFamily: 'system-ui, -apple-system, sans-serif', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, paddingBottom: '80px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px', marginTop: '20px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>✅</div>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: COLORS.text, marginBottom: '8px' }}>Simulation Complete</h2>
          <div style={{ fontSize: '16px', color: COLORS.cta, fontWeight: 600 }}>+{score.toLocaleString()} Skillions Earned</div>
        </div>

        <div style={{ background: COLORS.bgCard, borderRadius: '16px', padding: '20px', marginBottom: '24px', border: `1px solid ${COLORS.bgLight}` }}>
          <div style={{ fontSize: '12px', color: COLORS.textDim, marginBottom: '16px', fontWeight: 700, textTransform: 'uppercase' }}>Competencies Proven</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {metadata.primary_role_competencies_evaluated.map((skill, i) => (
              <span key={i} style={{ background: COLORS.highlightSoft, color: COLORS.highlight, fontSize: '12px', fontWeight: 500, padding: '8px 12px', borderRadius: '8px' }}>{skill}</span>
            ))}
          </div>
        </div>

        <div style={{ background: COLORS.bgCard, borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
          <div style={{ fontSize: '12px', color: COLORS.highlight, marginBottom: '16px', fontWeight: 700, textTransform: 'uppercase' }}>YOU'VE UNLOCKED</div>

          {/* Locked Certificate Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', padding: '12px', border: `1px dashed ${COLORS.textDim}`, borderRadius: '12px', opacity: 0.8 }}>
            <div style={{ fontSize: '24px', opacity: 0.5 }}>&#x1F393;</div>
            <div>
              <div style={{ fontSize: '14px', color: COLORS.textMuted, fontWeight: 600 }}>HR Manager Job Readiness Certification</div>
              <div style={{ fontSize: '11px', color: COLORS.textDim, marginTop: '2px' }}>Score >60% in 10 Simulations to Unlock</div>
            </div>
          </div>

          {deliverables.badges?.map((badge, i) => (
            <div key={`badge-${i}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '16px', background: COLORS.bgLight, padding: '12px', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '24px' }}>🏅</div>
                <div>
                  <div style={{ fontSize: '12px', color: COLORS.textMuted }}>Badge Earned</div>
                  <div style={{ fontSize: '14px', color: COLORS.text, fontWeight: 600 }}>{badge}</div>
                </div>
              </div>
              <button
                onClick={() => window.downloadBadge(badge)}
                style={{
                  background: 'transparent',
                  border: `1px solid ${COLORS.highlight}`,
                  borderRadius: '20px',
                  color: COLORS.highlight,
                  cursor: 'pointer',
                  padding: '8px 16px',
                  fontSize: '12px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                title="Download Badge"
              >
                Share
              </button>
            </div>
          ))}

          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: `1px solid ${COLORS.bgLight}` }}>
            <div style={{ fontSize: '11px', color: COLORS.textDim, marginBottom: '8px' }}>REAL TASKS YOU COMPLETED:</div>
            <ul style={{ margin: 0, paddingLeft: '20px', color: COLORS.textMuted, fontSize: '13px', lineHeight: 1.6 }}>
              {deliverables.recruiter_readable_proof?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {nextSimTitle && (
          <div style={{ padding: '16px', border: `1px dashed ${COLORS.textDim}`, borderRadius: '12px', opacity: 0.7 }}>
            <div style={{ fontSize: '11px', color: COLORS.textDim, marginBottom: '4px' }}>YOUR NEXT MISSION</div>
            <div style={{ fontSize: '14px', color: COLORS.textMuted, fontWeight: 600 }}>{nextSimTitle}</div>
          </div>
        )}
      </div>

      <div style={{ position: 'sticky', bottom: 0, padding: '20px 0', background: `linear-gradient(180deg, rgba(9, 22, 32, 0) 0%, #091620 20%)`, zIndex: 10 }}>
        <button onClick={onContinue} style={{ width: '100%', padding: '18px', background: COLORS.cta, border: 'none', borderRadius: '14px', cursor: 'pointer', fontSize: '16px', fontWeight: 600, color: '#0D2436', boxShadow: '0 4px 24px rgba(127, 194, 65, 0.3)' }}>
          Continue & Unlock Next Scenario
        </button>
      </div>
    </div>
  );
};

window.HRSimulationApp = function ({ simulationData }) {
  const COLORS = window.COLORS;
  const OptionButton = window.OptionButton;
  const CandidateCard = window.CandidateCard;
  const FeedbackPanel = window.FeedbackPanel;
  const EmailPreview = window.EmailPreview;

  // Deep Linking: Parse URL parameters for initial state
  const urlParams = new URLSearchParams(window.location.search);
  const initialSimIndex = parseInt(urlParams.get('sim_index') || '0', 10);
  const initialStepIndex = parseInt(urlParams.get('step_index') || '0', 10);

  // Determine initial screen based on params
  let initialScreen = 'start';
  if (urlParams.has('step_index')) {
    initialScreen = 'step';
  } else if (urlParams.has('sim_index') && initialSimIndex > 0) {
    initialScreen = 'start';
  }

  const [currentSimulationIndex, setCurrentSimulationIndex] = useState(initialSimIndex);
  const [screen, setScreen] = useState(initialScreen);
  const [currentStep, setCurrentStep] = useState(initialStepIndex);
  const [isExplainExpanded, setIsExplainExpanded] = useState(false);
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [optionIndices, setOptionIndices] = useState([]);
  const [hasAttemptedCurrentStep, setHasAttemptedCurrentStep] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen, currentStep]);

  // Analytics: Track Screen Views (Composite)
  React.useEffect(() => {
    let screenName = screen;
    if (screen === 'start') screenName = 'Start';
    if (screen === 'scenario') screenName = 'Scenario Intro';
    if (screen === 'step') screenName = `Step ${currentStep + 1}`;
    if (screen === 'sim_result') screenName = 'Results';
    if (screen === 'feedback') screenName = 'Feedback';

    const compositeName = `Sim ${currentSimulationIndex + 1} - ${screenName}`;
    window.trackEvent('screen_view', { screen_name: compositeName });
  }, [screen, currentStep, currentSimulationIndex]);

  // Analytics: Track Simulation Completion
  React.useEffect(() => {
    if (screen === 'sim_result') {
      const currentSim = simulations[currentSimulationIndex] || simulationData?.simulations?.[currentSimulationIndex];
      if (currentSim) {
        window.trackEvent('simulation_complete', {
          title: currentSim.simulation_metadata.simulation_title,
          score: score
        });
      }
    }
  }, [screen, currentSimulationIndex, score, simulationData]);

  const simulations = simulationData?.simulations || [];
  const currentSim = simulations[currentSimulationIndex];
  if (!currentSim) return <div style={{ color: COLORS.text, padding: '40px' }}>Simulation not found.</div>;

  const scenarios = currentSim.scenario_breakdown || [];
  const currentScenario = scenarios[0];

  const steps = currentSim.step_level_design || [];
  const step = steps[currentStep];

  useEffect(() => {
    if (step && step.options_inputs && Array.isArray(step.options_inputs) && step.options_inputs.length > 0) {
      // Create indices array [0, 1, 2, ...]
      const indices = step.options_inputs.map((_, i) => i);
      // Fisher-Yates Shuffle
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      setOptionIndices(indices);
      setShuffledOptions(indices.map(i => step.options_inputs[i]));
    } else {
      setShuffledOptions([]);
      setOptionIndices([]);
    }
    setHasAttemptedCurrentStep(false);
    setAttemptCount(0);
  }, [step]);

  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [selectedRisks, setSelectedRisks] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [stepResults, setStepResults] = useState([]);

  const handleCandidateSelect = (id) => {
    if (isFeedbackVisible) return;
    const updated = selectedCandidates.includes(id)
      ? selectedCandidates.filter(cid => cid !== id)
      : [...selectedCandidates, id];
    setSelectedCandidates(updated);

    // Auto-evaluate if selection is complete (e.g. 5 candidates for Sim 1 Step 1)
    if (currentSimulationIndex === 0 && currentStep === 0 && updated.length === 5) {
      evaluateStep(null, updated);
    }
  };

  const handleOptionSelect = (index) => {
    if (isFeedbackVisible) return;
    setSelectedOption(index);
    evaluateStep(index);
  };

  const handleRiskToggle = (candidateId, flagId) => {
    if (isFeedbackVisible) return;
    setSelectedRisks(prev => {
      const current = prev[candidateId] || [];
      const updated = current.includes(flagId) ? current.filter(f => f !== flagId) : [...current, flagId];
      return { ...prev, [candidateId]: updated };
    });
  };

  const evaluateStep = (optionIdx = null, candidates = null) => {
    let type = 'correct';

    // Determine the original logical index from the visual (shuffled) index
    const visualIndex = optionIdx !== null ? optionIdx : selectedOption;
    let originalIndex = visualIndex; // Default callback fallback

    if (visualIndex !== null && optionIndices.length > 0) {
      originalIndex = optionIndices[visualIndex];
    }

    if (originalIndex !== null) {
      if (originalIndex > 1) type = 'incorrect';
      else if (originalIndex === 1) type = 'partial';
    }

    // Points & Streak Logic
    let points = 0;
    let streakBonus = 0;

    // Only update streak if this is the first attempt at this step
    let currentStreakCount = streak;

    if (!hasAttemptedCurrentStep) {
      if (type === 'correct') {
        currentStreakCount = streak + 1;
        setStreak(currentStreakCount);
      } else {
        setStreak(0); // Break streak
        currentStreakCount = 0;
      }
      setHasAttemptedCurrentStep(true);
    }

    // Calculate Points
    if (type === 'correct' && !hasAttemptedCurrentStep) {
      // Base 10 + (Streak * 5)
      // Example: Streak 1 -> 10 + 5 = 15
      // Example: Streak 2 -> 10 + 10 = 20
      points = 10 + (currentStreakCount * 5);
    } else {
      // No points for partial, incorrect, or retries
      points = 0;
    }

    const result = {
      type: type,
      message: step.immediate_feedback || "Your decision has been recorded.",
      points: points
    };
    setStepResults(prev => [...prev, result]);
    setAttemptCount(prev => prev + 1);
    setIsFeedbackVisible(true);
  };

  const handleFeedbackComplete = () => {
    const lastResult = stepResults[stepResults.length - 1];
    if (lastResult.type === 'correct') {
      proceedToNextStep();
    } else {
      // Retry Flow
      setIsFeedbackVisible(false);
      setSelectedOption(null);    // Reset selection to allow picking again

      // Auto-expand explanation ONLY if user has failed 3 times
      if (attemptCount >= 3) {
        setTimeout(() => {
          setIsExplainExpanded(true);
        }, 300);
      }
    }
  };

  const proceedToNextStep = () => {
    // Add points from the just-completed step
    if (isFeedbackVisible && stepResults.length > 0) {
      const lastResult = stepResults[stepResults.length - 1];
      setScore(prev => prev + lastResult.points);
    }

    setIsFeedbackVisible(false);
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      setSelectedOption(null);
      setSelectedCandidates([]);
      setScreen('step');
    } else {
      setScreen('sim_result');
    }
    setIsExplainExpanded(false);
  };

  const nextSimulation = () => {
    setIsFeedbackVisible(false);
    if (currentSimulationIndex < simulations.length - 1) {
      setCurrentSimulationIndex(prev => prev + 1);
      setCurrentStep(0);
      setSelectedOption(null);
      setSelectedCandidates([]);
      setStepResults([]);
      setScreen('start');
    } else {
      setScreen('results');
    }
  };

  if (screen === 'start') {
    return (
      <div style={{ minHeight: '100vh', background: `linear-gradient(180deg, ${COLORS.bg} 0%, #091620 100%)`, display: 'flex', flexDirection: 'column', padding: '24px 20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ background: COLORS.highlightSoft, color: COLORS.highlight, fontSize: '11px', fontWeight: 600, letterSpacing: '0.5px', padding: '6px 12px', borderRadius: '20px', alignSelf: 'flex-start', marginBottom: '20px' }}>SIMULATION {currentSimulationIndex + 1} OF {simulations.length}</div>
          <h1 style={{ fontSize: '32px', fontWeight: 300, color: COLORS.text, lineHeight: 1.2, marginBottom: '16px' }}>{currentSim.simulation_metadata.simulation_title}</h1>
          {/* <p style={{ fontSize: '15px', color: COLORS.textMuted, lineHeight: 1.6, marginBottom: '32px' }}>{currentSim.simulation_metadata.why_this_matters_for_getting_hired}.<br /><br /><strong>Your Actions Will Solve Key Job Requirements:</strong></p> */}
          <p style={{ fontSize: '15px', color: COLORS.textMuted, lineHeight: 1.6, marginBottom: '32px' }}><strong>Your Actions Will Solve Key Job Requirements:</strong></p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '40px' }}>
            {currentSim.simulation_metadata.primary_role_competencies_evaluated.slice(0, 4).map((skill, i) => (
              <span key={i} style={{ background: COLORS.bgCard, color: COLORS.textMuted, fontSize: '12px', padding: '8px 12px', borderRadius: '8px' }}>{skill}</span>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: COLORS.textDim, fontSize: '13px', marginBottom: '8px' }}>
            <span style={{ fontSize: '16px' }}>⏱</span>{currentSim.simulation_metadata.estimated_time || '15 minutes'} · {steps.length} critical decisions
          </div>
          <div style={{ position: 'absolute', top: '24px', right: '20px', background: COLORS.highlightSoft, color: COLORS.highlight, fontSize: '13px', fontWeight: 700, padding: '8px 12px', borderRadius: '12px' }}>
            ⚡️ {score.toLocaleString()}
          </div>
        </div>
        <div style={{ position: 'sticky', bottom: 0, padding: '20px 0', background: 'linear-gradient(180deg, rgba(9, 22, 32, 0) 0%, #091620 20%)', zIndex: 10, marginTop: 'auto' }}>
          <button id="start-simulation" onClick={() => {
            window.trackEvent('simulation_start', { title: currentSim.simulation_metadata.simulation_title });
            setScreen('scenario');
          }} style={{ width: '100%', padding: '18px', background: COLORS.cta, border: 'none', borderRadius: '14px', cursor: 'pointer', fontSize: '16px', fontWeight: 600, color: '#0D2436', boxShadow: '0 4px 24px rgba(127, 194, 65, 0.3)' }}>Start Simulation</button>
        </div>
      </div >
    );
  }

  if (screen === 'scenario') {
    return (
      <div style={{ minHeight: '100vh', background: COLORS.bg, padding: '24px 20px', fontFamily: 'system-ui, -apple-system, sans-serif', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 300, color: COLORS.text, lineHeight: 1.3, marginBottom: '20px' }}>{currentScenario.scenario_title}</h2>

        <div style={{ background: COLORS.bgCard, borderRadius: '8px', padding: '16px', marginBottom: '24px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <span style={{ fontSize: '20px', marginTop: '-2px' }}>🏢</span>
          <span style={{ fontSize: '14px', color: COLORS.textMuted, lineHeight: 1.5 }}>
            You're an HR Manager in a <strong>{currentScenario.workplace_context.company_type}</strong>.
            <br />
            REMEMBER: {currentScenario.workplace_context.business_state}.
          </span>
        </div>

        <div style={{ background: COLORS.warningBg, borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
          <div style={{ fontSize: '13px', color: COLORS.warning, fontWeight: 600, marginBottom: '6px' }}>⚡ SOLVE THIS CRISIS</div>
          <p style={{ fontSize: '14px', color: COLORS.textMuted, lineHeight: 1.6, margin: 0 }}>
            {currentScenario.crisis_or_decision_trigger}
          </p>
        </div>

        {/* 
        <div style={{ background: COLORS.bgCard, borderRadius: '12px', padding: '16px', marginBottom: '32px' }}>
          <div style={{ fontSize: '12px', color: COLORS.textDim, marginBottom: '10px' }}>CENTRAL ARTEFACT</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: COLORS.highlightSoft, width: '44px', height: '44px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>📋</div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: COLORS.text }}>{currentScenario.central_artefact}</div>
              <div style={{ fontSize: '12px', color: COLORS.textMuted }}>Contextual work document</div>
            </div>
          </div>
        </div>
        */}
        <div style={{ position: 'sticky', bottom: 0, padding: '20px 0', background: COLORS.bg, zIndex: 10, marginTop: 'auto' }}>
          <button id="begin-simulation" onClick={() => setScreen('step')} style={{ width: '100%', padding: '18px', background: COLORS.cta, border: 'none', borderRadius: '14px', cursor: 'pointer', fontSize: '16px', fontWeight: 600, color: '#0D2436', boxShadow: '0 4px 24px rgba(127, 194, 65, 0.3)' }}>Begin</button>
        </div>
      </div >
    );
  }

  if (screen === 'step') {
    let artefact = null;
    if (isFeedbackVisible) {
      const result = stepResults[stepResults.length - 1];
      artefact = (
        <div style={{ marginTop: '20px' }}>
          <FeedbackPanel
            type={result.type}
            message={result.message}
            points={result.points}
            outcomes={step.outcomes}
            onComplete={handleFeedbackComplete}
          />
        </div>
      );
    } else {

      // Use description for smart artifact selection
      const description = step.artefact_interaction_description ? step.artefact_interaction_description.toLowerCase() : '';

      // Check for specific "Candidate Selection" artifact (Sim 1 type)
      const isCandidateSelection = step.interaction_type === 'selection' && description.includes('candidate tiles');

      if (isCandidateSelection) {
        artefact = (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '12px', color: COLORS.textDim, marginBottom: '10px' }}>SELECTED: {selectedCandidates.length}/5</div>
            <div style={{ maxHeight: '420px', overflowY: 'auto', paddingRight: '12px' }}>
              {window.MOCK_CANDIDATES.map(c => (
                <CandidateCard key={c.id} candidate={c} selected={selectedCandidates.includes(c.id)} onSelect={handleCandidateSelect} compact />
              ))}
            </div>
          </div>
        );
      } else if (description.includes('chat thread')) {
        // V2 S1 Step 1: Chat Response
        // We try to find the scenario context to get the incoming message
        const scenario = currentSim.scenario_breakdown.find(s => s.scenario_id === step.scenario_id);
        const message = scenario ? scenario.crisis_or_decision_trigger : "How do you respond?";
        artefact = <window.ChatResponseSelector incomingMessage={message} options={shuffledOptions} onSelect={(idx) => { handleOptionSelect(idx); evaluateStep(idx); }} />;
      } else if (description.includes('timeline')) {
        // V2 S1 Step 2: Timeline
        artefact = <window.TimelineVisualizer options={shuffledOptions} onSelect={(idx) => { handleOptionSelect(idx); evaluateStep(idx); }} />;
      } else if (description.includes('huddle')) {
        // V2 S1 Step 3: Video Call
        artefact = <window.VideoCallProfile options={shuffledOptions} onSelect={(idx) => { handleOptionSelect(idx); evaluateStep(idx); }} />;
      } else if (description.includes('comparison')) {
        // V2 S1 Step 4: Comparison
        artefact = <window.CandidateComparisonTable options={shuffledOptions} onSelect={(idx) => { handleOptionSelect(idx); evaluateStep(idx); }} />;
      } else if (description.includes('approval note')) {
        // V2 S2 Step 6: Approval Note
        artefact = <window.ApprovalNoteBuilder options={shuffledOptions} onSelect={(idx) => { handleOptionSelect(idx); evaluateStep(idx); }} />;
      } else if (description.includes('one-page memo')) {
        // V2 S3 Step 9: Memo Structure
        artefact = <window.MemoStructureBuilder options={shuffledOptions} onSelect={(idx) => { handleOptionSelect(idx); evaluateStep(idx); }} />;
      } else if (description.includes('closure proof')) {
        // V2 S3 Step 15: Closure Proof
        artefact = <window.ClosureProofPacket options={shuffledOptions} onSelect={(idx) => { handleOptionSelect(idx); evaluateStep(idx); }} />;
      } else if ((step.interaction_type === 'ordering' || step.interaction_type === 'selection') && step.options_inputs) {
        // Generic multi-select / ordering builder
        artefact = (
          <window.RationaleBuilder
            pool={shuffledOptions}
            maxSelection={step.max_selection || 3}
            onComplete={(selected) => evaluateStep(selected[0])}
          />
        );
      } else if (step.interaction_type === 'trade-off meters' && !step.options_inputs) {
        // Legacy Slider Custom Component (Sim 1 V1)
        const meters = [
          { label: 'Hiring Speed', initial: 70 },
          { label: 'Quality Bar', initial: 80 },
          { label: 'Internal Trust', initial: 60 }
        ];
        artefact = <window.TradeOffMeters meters={meters} onComplete={(values) => evaluateStep(0)} />;
      } else if (step.options_inputs && step.options_inputs.length > 0) {
        // Catch-all for MCQ, custom_compose, trade_off_meters (button variant)
        artefact = (
          <div style={{ marginBottom: '20px' }}>
            {shuffledOptions.map((opt, i) => (
              <OptionButton key={i} label={opt} selected={selectedOption === i} onClick={() => handleOptionSelect(i)} />
            ))}
          </div>
        );
      } else {
        artefact = (
          <div style={{ background: COLORS.bgCard, borderRadius: '12px', padding: '24px', textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🛠️</div>
            <div style={{ fontSize: '14px', color: COLORS.textMuted }}>Interaction: {step.interaction_type}</div>
            <div style={{ position: 'sticky', bottom: 0, padding: '20px 0', background: COLORS.bgCard, zIndex: 10 }}>
              <button id="mock-complete" onClick={() => evaluateStep()} style={{ width: '100%', background: COLORS.cta, border: 'none', padding: '16px', borderRadius: '12px', color: '#0D2436', fontWeight: 600 }}>Mock Completion</button>
            </div>
          </div>
        );
      }
    }

    return (
      <div style={{ minHeight: '100vh', background: COLORS.bg, padding: '20px', fontFamily: 'system-ui, -apple-system, sans-serif', display: 'flex', flexDirection: 'column' }}>
        {/* Progress Bar: Scenario Scoped & Smooth */}
        <div style={{ height: '6px', background: COLORS.bgCard, borderRadius: '3px', overflow: 'hidden', marginBottom: '24px' }}>
          <div style={{
            height: '100%',
            width: `${((steps.filter(s => s.scenario_id === step.scenario_id).findIndex(s => s.step_id === step.step_id) + 1) / steps.filter(s => s.scenario_id === step.scenario_id).length) * 100}%`,
            background: COLORS.highlight,
            borderRadius: '3px',
            transition: 'width 0.8s cubic-bezier(0.22, 1, 0.36, 1)'
          }} />
        </div>
        <div style={{ fontSize: '11px', fontWeight: 600, color: COLORS.textDim, letterSpacing: '0.5px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
          <span>STEP {currentStep + 1} OF {steps.length}</span>
          <div style={{ display: 'flex', gap: '12px' }}>
            {streak > 1 && <span style={{ color: COLORS.warning, fontWeight: 700 }}>🔥 {streak}</span>}
            <span style={{ color: COLORS.highlight }}>⚡️ {score.toLocaleString()}</span>
          </div>
        </div>
        <h3 style={{ fontSize: '20px', fontWeight: 400, color: COLORS.text, lineHeight: 1.35, marginBottom: '16px' }}>{step.instruction_question}</h3>

        <div style={{ marginBottom: '24px' }}>
          <button
            onClick={() => setIsExplainExpanded(!isExplainExpanded)}
            style={{
              background: 'transparent',
              border: 'none',
              padding: 0,
              color: COLORS.highlight,
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span style={{ transform: isExplainExpanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▶</span>
            Explain This Question
          </button>

          {isExplainExpanded && (
            <div style={{
              marginTop: '12px',
              background: 'rgba(64, 106, 255, 0.08)',
              borderRadius: '12px',
              padding: '16px',
              border: `1px solid ${COLORS.highlight}`,
              borderLeft: `4px solid ${COLORS.highlight}`
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ fontSize: '18px' }}>💡</span>
                <p style={{ fontSize: '13px', color: COLORS.text, lineHeight: 1.6, margin: 0 }}>
                  {step.explain_this_question}
                </p>
              </div>
            </div>
          )}
        </div>
        {artefact}
        {(selectedOption !== null || selectedCandidates.length > 0) && currentSimulationIndex === 0 && currentStep === 0 && (
          <div style={{ position: 'sticky', bottom: 0, padding: '16px 0 20px 0', background: COLORS.bg, zIndex: 10, marginTop: 'auto' }}>
            <button id="confirm-decision" onClick={() => evaluateStep()} style={{ width: '100%', padding: '18px', background: COLORS.cta, border: 'none', borderRadius: '14px', cursor: 'pointer', fontSize: '16px', fontWeight: 600, color: '#0D2436', boxShadow: '0 4px 24px rgba(127, 194, 65, 0.3)' }}>Confirm Decision</button>
          </div>
        )}
      </div>
    );
  }


  if (screen === 'closure') {
    return (
      <div style={{ minHeight: '100vh', background: `linear-gradient(180deg, ${COLORS.bg} 0%, #091620 100%)`, padding: '24px 20px', fontFamily: 'system-ui, -apple-system, sans-serif', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }}>
          <div style={{ background: COLORS.successBg, color: COLORS.success, fontSize: '11px', fontWeight: 600, letterSpacing: '0.5px', padding: '8px 14px', borderRadius: '20px', display: 'inline-block', marginBottom: '24px' }}>✓ SIMULATION COMPLETE</div>
          <h2 style={{ fontSize: '28px', fontWeight: 300, color: COLORS.text, lineHeight: 1.3, marginBottom: '16px' }}>Scenario Handled.</h2>
          <p style={{ fontSize: '14px', color: COLORS.textMuted, lineHeight: 1.6, marginBottom: '32px' }}>{currentSim.simulation_metadata.end_state}</p>
          <div style={{ background: COLORS.highlightSoft, borderRadius: '12px', padding: '16px', borderLeft: `4px solid ${COLORS.highlight}` }}>
            <p style={{ fontSize: '14px', color: COLORS.text, fontStyle: 'italic', lineHeight: 1.6, margin: 0 }}>"{currentSim.simulation_metadata.hook_to_next_simulation}"</p>
          </div>
        </div>
        <div style={{ position: 'sticky', bottom: 0, padding: '20px 0', background: '#091620', zIndex: 10, marginTop: 'auto' }}>
          <button id="unlock-next" onClick={nextSimulation} style={{ width: '100%', padding: '18px', background: COLORS.cta, border: 'none', borderRadius: '14px', cursor: 'pointer', fontSize: '16px', fontWeight: 600, color: '#0D2436', boxShadow: '0 4px 24px rgba(127, 194, 65, 0.3)' }}>
            {currentSimulationIndex < simulations.length - 1 ? 'Unlock Next Scenario' : 'View Full Results'}
          </button>
        </div>
      </div>
    );
  }

  if (screen === 'sim_result') {
    const nextSim = simulations[currentSimulationIndex + 1];
    return (
      <window.SimulationResult
        simulation={currentSim}
        score={score}
        onContinue={nextSimulation}
        nextSimTitle={nextSim ? nextSim.simulation_metadata.simulation_title : null}
      />
    )
  }

  if (screen === 'results') {
    return (
      <div style={{ minHeight: '100vh', background: `linear-gradient(180deg, ${COLORS.bg} 0%, #091620 100%)`, padding: '24px 20px', fontFamily: 'system-ui, -apple-system, sans-serif', display: 'flex', flexDirection: 'column' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px', marginTop: '40px' }}>
          <div style={{ fontSize: '12px', color: COLORS.textDim, marginBottom: '8px', letterSpacing: '1px' }}>TOTAL SCORE</div>
          <h1 style={{ fontSize: '48px', fontWeight: 700, color: COLORS.highlight, margin: 0, textShadow: `0 0 20px ${COLORS.highlight}40` }}>{score.toLocaleString()}</h1>
          <div style={{ fontSize: '14px', color: COLORS.textMuted, marginTop: '4px' }}>Skillions Earned</div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontSize: '12px', color: COLORS.textDim, marginBottom: '16px', fontWeight: 600, paddingLeft: '4px' }}>COMPETENCIES PROVEN</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {['Crisis Mgmt', 'Prioritisation', 'Stakeholder Comms', 'Risk Assessment'].map((skill, i) => (
                <div key={i} style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.highlight}`, color: COLORS.text, fontSize: '12px', padding: '8px 14px', borderRadius: '20px' }}>★ {skill}</div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '12px', color: COLORS.textDim, marginBottom: '16px', fontWeight: 600, paddingLeft: '4px' }}>DELIVERABLES UNLOCKED</div>
            {simulations.map((s, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: COLORS.highlightSoft, borderRadius: '12px', marginBottom: '10px', borderLeft: `4px solid ${COLORS.highlight}` }}>
                <span style={{ fontSize: '24px' }}>🏆</span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: COLORS.text }}>{s.simulation_metadata.simulation_title}</div>
                  <div style={{ fontSize: '12px', color: COLORS.textMuted }}>Certified Output Generated</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ opacity: 0.5 }}>
            <div style={{ fontSize: '12px', color: COLORS.textDim, marginBottom: '16px', fontWeight: 600, paddingLeft: '4px' }}>UPCOMING CONTENT (LOCKED)</div>
            <div style={{ padding: '16px', background: COLORS.bgCard, borderRadius: '12px', border: `1px dashed ${COLORS.textDim}`, display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '20px' }}>🔒</span>
              <div style={{ fontSize: '13px', color: COLORS.textMuted }}>Advanced Negotiation Scenarios</div>
            </div>
          </div>
        </div>

        <div style={{ position: 'sticky', bottom: 0, padding: '20px 0', background: 'transperant', zIndex: 10, marginTop: 'auto' }}>
          <button id="reset-path" onClick={() => window.location.reload()} style={{ width: '100%', padding: '18px', background: COLORS.cta, border: 'none', borderRadius: '14px', cursor: 'pointer', fontSize: '16px', fontWeight: 600, color: '#0D2436', boxShadow: '0 4px 24px rgba(127, 194, 65, 0.3)' }}>Start New Path</button>
        </div>
      </div>
    );
  }

  return null;
};
