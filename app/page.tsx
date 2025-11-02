export default function Home() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>Product Hunt Agent API</h1>
      <p>Send POST requests to /api/ask with JSON body:</p>
      <pre style={{ background: '#f4f4f4', padding: '1rem', borderRadius: '4px' }}>
{`{
  "question": "Which product has the most comments today?"
}`}
      </pre>
      <p>Example questions:</p>
      <ul>
        <li>Which product has the most votes?</li>
        <li>Are there any AI products launched today?</li>
        <li>What are the top 3 products by comments?</li>
        <li>Find products related to productivity</li>
      </ul>
    </div>
  );
}
