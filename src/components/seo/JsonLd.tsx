/**
 * JSON-LD 是数据不是脚本，按 Next 指南用原生 <script>；
 * 把 < 转义成 <，避免数据里的文案提前闭合 script 标签。
 */
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
