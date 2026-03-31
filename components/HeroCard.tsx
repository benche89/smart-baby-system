export default function HeroCard() {
  return (
    <div className="hero__card">
      <div className="phone">
        <div className="phone__top">
          <span>Today’s insight</span>
          <span>9:42 AM</span>
        </div>

        <div className="insight insight--main">
          <p className="insight__label">Prediction</p>
          <h3>Your baby may need sleep in about 35 minutes</h3>
          <p>
            Based on the last 5 days, wake window and mood suggest growing
            tiredness.
          </p>
        </div>

        <div className="insight">
          <p className="insight__label">What to do now</p>
          <p>Keep stimulation low and prepare for nap time soon.</p>
        </div>

        <div className="insight">
          <p className="insight__label">Pattern detected</p>
          <p>Fussiness at this hour is more likely sleep-related than hunger.</p>
        </div>
      </div>
    </div>
  );
}