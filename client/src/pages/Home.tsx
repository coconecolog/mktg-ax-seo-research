/**
 * Search Desk design: Japanese editorial modernism with an asymmetric research desk.
 * Use warm paper, Axis Indigo, editorial rules, compass motifs and evidence-first interaction.
 */
import { useMemo, useState } from "react";
import {
  ArrowDownToLine,
  ArrowUpRight,
  Check,
  ChevronDown,
  CircleHelp,
  Compass,
  FileText,
  Filter,
  Lightbulb,
  Search,
  SlidersHorizontal,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import { articles, clusterMeta, sourceLinks, type Article, type Cluster } from "@/data/articles";

const clusters = Object.keys(clusterMeta) as Cluster[];
const audiences = ["全企業", "新規事業", "スタートアップ", "メーカー"] as const;
const stages = ["構想", "設計", "実装", "計測", "拡張"] as const;

function score(article: Article) {
  return article.demand * 1.4 + article.impact * 1.8 - article.effort * 0.45;
}

function Dot({ article, compact = false }: { article: Article; compact?: boolean }) {
  const color = clusterMeta[article.cluster].color;
  return (
    <span
      className={`priority-dot ${compact ? "priority-dot--compact" : ""}`}
      style={{ backgroundColor: color }}
      title={`${article.title}｜需要 ${article.demand}/5・事業インパクト ${article.impact}/5`}
    />
  );
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [cluster, setCluster] = useState<Cluster | "すべて">("すべて");
  const [audience, setAudience] = useState<(typeof audiences)[number] | "すべて">("すべて");
  const [stage, setStage] = useState<(typeof stages)[number] | "すべて">("すべて");
  const [priority, setPriority] = useState<"すべて" | "A" | "B" | "C">("すべて");
  const [expanded, setExpanded] = useState<number | null>(1);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return articles
      .filter((article) => cluster === "すべて" || article.cluster === cluster)
      .filter((article) => audience === "すべて" || article.audience === audience)
      .filter((article) => stage === "すべて" || article.stage === stage)
      .filter((article) => priority === "すべて" || article.priority === priority)
      .filter((article) => {
        if (!normalized) return true;
        return [article.keyword, article.title, article.intent, article.angle, article.outcome]
          .join(" ")
          .toLowerCase()
          .includes(normalized);
      })
      .sort((a, b) => score(b) - score(a) || a.id - b.id);
  }, [query, cluster, audience, stage, priority]);

  const totalA = articles.filter((article) => article.priority === "A").length;
  const topTen = [...articles].sort((a, b) => score(b) - score(a) || a.id - b.id).slice(0, 10);
  const clearFilters = () => {
    setQuery("");
    setCluster("すべて");
    setAudience("すべて");
    setStage("すべて");
    setPriority("すべて");
  };

  const exportCsv = () => {
    const header = ["ID", "クラスター", "優先", "キーワード", "記事タイトル", "検索意図", "対象", "段階", "需要", "事業インパクト", "工数", "成果物"];
    const rows = filtered.map((item) => [item.id, item.cluster, item.priority, item.keyword, item.title, item.intent, item.audience, item.stage, item.demand, item.impact, item.effort, item.outcome]);
    const csv = [header, ...rows]
      .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([`\ufeff${csv}`], { type: "text/csv;charset=utf-8;" });
    const href = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.download = "mktg-ax-seo-article-opportunities.csv";
    anchor.click();
    URL.revokeObjectURL(href);
  };

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="MKTG AX SEO 記事機会マップの先頭へ">
          <img src="/manus-storage/mktg-ax-mark_54aaa0cb.png" alt="MKTG AXの抽象ロゴ" />
          <span className="brand-word">MKTG AX <em>/</em> RESEARCH</span>
        </a>
        <nav className="topnav" aria-label="ページ内ナビゲーション">
          <a href="#opportunities">記事機会</a>
          <a href="#playbook">90日プレイブック</a>
          <a href="#method">調査方法</a>
        </nav>
        <button className="export-button" onClick={exportCsv} type="button">
          <ArrowDownToLine size={16} aria-hidden="true" />
          CSVを保存
        </button>
      </header>

      <main id="top">
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div className="eyebrow"><Compass size={15} aria-hidden="true" /> SEARCH OPPORTUNITY MAP / 2026</div>
            <h1 id="hero-title">検索需要を、<br /><i>稟議に通る</i>仮説へ。</h1>
            <p>新規事業、スタートアップ、老舗メーカーの少人数チームへ。検索で勝つためのテーマを、上申・実装・ROIの視点から<strong>100件</strong>に絞り込みました。</p>
            <div className="hero-actions">
              <a className="primary-link" href="#opportunities">100件の機会を見る <ArrowUpRight size={16} /></a>
              <span className="hero-note">調査日：2026.08.26 / 相対優先度評価</span>
            </div>
          </div>
          <div className="hero-art" aria-label="検索コンパスの抽象ビジュアル">
            <img src="/manus-storage/seo-compass-hero_451d1768.jpg" alt="紙の地形図の上に置かれた、青緑と真鍮の検索コンパス" />
          </div>
          <div className="hero-rule" />
        </section>

        <section className="metric-strip" aria-label="提案のサマリー">
          <div><span className="metric-value">100</span><span className="metric-label">SEO記事候補</span></div>
          <div><span className="metric-value">{totalA}</span><span className="metric-label">優先A / 90日候補</span></div>
          <div><span className="metric-value">5</span><span className="metric-label">検索クラスター</span></div>
          <div className="metric-note"><span className="evidence-pin" />月間検索数の推計ではなく、公開SERP・検索意図・商談への近さ・要件適合を使った<strong>相対評価</strong>です。</div>
        </section>

        <section className="brief-section" aria-labelledby="brief-title">
          <aside className="section-rail"><span>01</span><small>EDITOR&apos;S BRIEF</small></aside>
          <div className="brief-main">
            <p className="section-kicker">編集判断</p>
            <h2 id="brief-title">「広く読まれる」より、<br />「次の意思決定が進む」を優先する。</h2>
            <p>立ち上げ期のデジマは、記事を量産するほど成果が出るわけではありません。まず、経営・営業・現場に説明できるテーマを選び、検証の設計を伴わせることが必要です。計測環境を先に整え、小さく始めて改善する流れは、少人数チームの現実にも合います。[1]</p>
          </div>
          <div className="brief-aside">
            <div className="brief-card"><Lightbulb size={18} /><strong>このマップの使い方</strong><span>対象企業・実行段階・優先度で絞り、最初の10件を選んでください。タイトルを開くと、狙いと成果物を確認できます。</span></div>
            <img src="/manus-storage/priority-orbit_51e78f9a.jpg" alt="紙の同心円とマーカーで構成された優先順位の抽象イメージ" />
          </div>
        </section>

        <section id="opportunities" className="opportunity-section" aria-labelledby="opportunity-title">
          <div className="section-title-row">
            <div>
              <p className="section-kicker">02 / OPPORTUNITY INDEX</p>
              <h2 id="opportunity-title">記事機会を、いまの課題から探す。</h2>
            </div>
            <div className="result-count"><span>{filtered.length}</span> / 100 themes</div>
          </div>

          <div className="filter-panel">
            <div className="search-field">
              <Search size={18} aria-hidden="true" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="キーワード・タイトル・悩みで検索" aria-label="記事候補を検索" />
              {query && <button type="button" onClick={() => setQuery("")} aria-label="検索語を消去"><X size={16} /></button>}
            </div>
            <div className="filter-groups">
              <div className="filter-group"><span><Filter size={14} />テーマ</span><div className="chip-row"><button className={cluster === "すべて" ? "chip active" : "chip"} onClick={() => setCluster("すべて")} type="button">すべて</button>{clusters.map((item) => <button key={item} className={cluster === item ? "chip active" : "chip"} onClick={() => setCluster(item)} type="button">{item}</button>)}</div></div>
              <div className="filter-group"><span><Target size={14} />対象</span><div className="chip-row"><button className={audience === "すべて" ? "chip active" : "chip"} onClick={() => setAudience("すべて")} type="button">すべて</button>{audiences.map((item) => <button key={item} className={audience === item ? "chip active" : "chip"} onClick={() => setAudience(item)} type="button">{item}</button>)}</div></div>
              <div className="filter-group"><span><SlidersHorizontal size={14} />段階</span><div className="chip-row"><button className={stage === "すべて" ? "chip active" : "chip"} onClick={() => setStage("すべて")} type="button">すべて</button>{stages.map((item) => <button key={item} className={stage === item ? "chip active" : "chip"} onClick={() => setStage(item)} type="button">{item}</button>)}</div></div>
            </div>
            <div className="priority-filter"><span>優先</span>{(["すべて", "A", "B", "C"] as const).map((item) => <button key={item} className={priority === item ? "priority-pill selected" : "priority-pill"} onClick={() => setPriority(item)} type="button">{item === "すべて" ? "すべて" : `優先 ${item}`}</button>)}<button className="clear-button" onClick={clearFilters} type="button">条件を解除</button></div>
          </div>

          <div className="cluster-board" aria-label="クラスター別の記事数">
            {clusters.map((item) => {
              const count = filtered.filter((article) => article.cluster === item).length;
              return <button key={item} type="button" className={cluster === item ? "cluster-bar selected" : "cluster-bar"} onClick={() => setCluster(cluster === item ? "すべて" : item)}>
                <span className="cluster-bar-top"><i style={{ background: clusterMeta[item].color }} />{item}<b>{count}</b></span>
                <span className="bar-track"><span style={{ width: `${(count / 20) * 100}%`, background: clusterMeta[item].color }} /></span>
                <small>{clusterMeta[item].note}</small>
              </button>;
            })}
          </div>

          <div className="table-wrap">
            <div className="table-head" role="row"><span>#</span><span>優先</span><span>検索語 / 記事タイトル</span><span>対象</span><span>実行段階</span><span>需要</span><span>事業効果</span><span aria-label="詳細" /></div>
            <div className="article-list">
              {filtered.map((article) => (
                <article className={expanded === article.id ? "article-row expanded" : "article-row"} key={article.id}>
                  <button className="article-summary" onClick={() => setExpanded(expanded === article.id ? null : article.id)} aria-expanded={expanded === article.id} type="button">
                    <span className="number-cell">{String(article.id).padStart(2, "0")}</span>
                    <span className={`priority-tag priority-${article.priority}`}>{article.priority}</span>
                    <span className="title-cell"><small>{article.keyword}</small><strong>{article.title}</strong></span>
                    <span className="audience-cell">{article.audience}</span>
                    <span className="stage-cell">{article.stage}</span>
                    <span className="score-cell"><span className="score-dots">{Array.from({ length: 5 }, (_, index) => <i key={index} className={index < article.demand ? "on" : ""} />)}</span><small>{article.demand}/5</small></span>
                    <span className="score-cell"><span className="score-dots score-dots--impact">{Array.from({ length: 5 }, (_, index) => <i key={index} className={index < article.impact ? "on" : ""} />)}</span><small>{article.impact}/5</small></span>
                    <span className="chevron"><ChevronDown size={17} /></span>
                  </button>
                  {expanded === article.id && <div className="article-detail"><div><span>狙う検索意図</span><p>{article.intent}</p></div><div><span>実務の切り口</span><p>{article.angle}</p></div><div><span>記事で得る成果物</span><p><Check size={14} />{article.outcome}</p></div><div className="detail-foot"><Dot article={article} compact /><span>工数目安 {article.effort}/5</span></div></div>}
                </article>
              ))}
            </div>
            {!filtered.length && <div className="empty-state"><CircleHelp size={26} /><strong>条件に一致する記事案はありません。</strong><span>検索語や絞り込みを変えるか、条件を解除してください。</span><button type="button" onClick={clearFilters}>条件を解除する</button></div>}
          </div>
        </section>

        <section className="priority-section" aria-labelledby="priority-title">
          <aside className="section-rail section-rail--dark"><span>03</span><small>90-DAY START</small></aside>
          <div className="priority-content">
            <p className="section-kicker section-kicker--light">最初の90日</p>
            <h2 id="priority-title">小さく証明し、<br />次の投資につなげる。</h2>
            <p>最初から100件を書かないでください。計測・顧客理解・検索資産の順に<strong>優先A</strong>を10件選び、3か月で「どの課題に、どの言葉で、誰が反応するか」を示します。</p>
            <div className="top-ten-list">
              {topTen.map((item, index) => <button key={item.id} type="button" onClick={() => { setExpanded(item.id); document.getElementById("opportunities")?.scrollIntoView({ behavior: "smooth" }); }}><span>{String(index + 1).padStart(2, "0")}</span><Dot article={item} compact /><strong>{item.title}</strong><ArrowUpRight size={15} /></button>)}
            </div>
          </div>
          <div className="roi-art"><img src="/manus-storage/roi-gate_74215c47.jpg" alt="真鍮の扉と木製ブロックで表した、ROIの検証を進める抽象イメージ" /><div><Sparkles size={17} /><strong>検証のものさし</strong><span>月次の売上だけでなく、検索表示、良質流入、商談化、営業受容の順に評価します。</span></div></div>
        </section>

        <section id="playbook" className="playbook-section" aria-labelledby="playbook-title">
          <div className="section-title-row"><div><p className="section-kicker">04 / EXECUTION PLAYBOOK</p><h2 id="playbook-title">1〜2名チームの、最初の90日。</h2></div><p className="side-caption">期限と撤退条件を先に置くと、上申は通しやすくなります。</p></div>
          <div className="timeline">
            <article><span>DAY 01–14</span><h3>土台をつくる</h3><p>GA4・Search Console・CV定義を整え、営業とMQLの仮定を合わせます。</p><em>読む：#1 #3 #28 #52</em></article>
            <article><span>DAY 15–45</span><h3>10件で検証する</h3><p>顧客の質問、比較、導入条件を中心に、優先Aの記事を公開します。</p><em>読む：#22 #23 #24 #40</em></article>
            <article><span>DAY 46–90</span><h3>伸びた論点へ寄せる</h3><p>検索クエリと営業の反応から、リライトと次クラスターを決めます。</p><em>読む：#30 #31 #53 #58</em></article>
          </div>
        </section>

        <section id="method" className="method-section" aria-labelledby="method-title">
          <div className="method-grid"><div><p className="section-kicker">05 / METHODOLOGY</p><h2 id="method-title">検索数の大きさではなく、<br />勝つ意味の大きさで選ぶ。</h2><p>本提案は、検索ボリュームの推計値を装っていません。公開SERPに現れるテーマ、読者の意思決定への近さ、少人数で検証できる速度、事業インパクトを組み合わせた<strong>相対優先度</strong>です。実装前には、自社のSearch Console、キーワードプランナー、商談ログで再評価してください。</p></div><div className="method-card"><FileText size={20} /><strong>選定の4軸</strong><ol><li>検索意図の明確さ</li><li>上申・商談への近さ</li><li>一次情報での差別化余地</li><li>90日での検証可能性</li></ol></div></div>
          <div className="source-list"><span>参照した公開資料</span>{sourceLinks.map((source, index) => <a href={source.url} key={source.url} target="_blank" rel="noreferrer">[{index + 1}] {source.label}<ArrowUpRight size={14} /></a>)}</div>
          <p className="access-note">注記：ご指定の mktg-ax.dev は調査時点でこの環境からDNS解決できず、既存コンテンツは評価対象に含めていません。公開内容を確認でき次第、重複・内部リンク・既存順位を踏まえて優先度を再調整してください。</p>
        </section>
      </main>

      <footer className="footer"><span>© 2026 MKTG AX / SEO OPPORTUNITY MAP</span><a href="#top">上へ戻る ↑</a></footer>
    </div>
  );
}
