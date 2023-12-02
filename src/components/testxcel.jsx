import exportToExcel from "./exportToExcel";
import ExportToExcel from "./exportToExcel";
var sampleData = [
  {
    subscribe: 1,
    openid: "o7Zv3s_F0N3-h09fLN3jOIM8WNwzsdsdsdo",
    nickname: "name1",
    sex: 1,
    language: "zh_CN",
    city: "杭州",
    province: "浙江",
    country: "中国",
    headimgurl:
      "http://wx.qlogo.cn/mmopen/s3NiblUuUDR7y3s1DsZibAja25icOumEM4KM79w8pKB5g0o2KKvVDWAqtVuCNVicZIzcqWzOS32ueOvD7tjmRVj2zQ/0",
    subscribe_time: 1439719607,
  },
  {
    subscribe: 1,
    openid: "o7Zv3sz92svh2lv_mMg1wewejY0OpU3Q8",
    nickname: "name2",
    sex: 1,
    language: "zh_CN",
    city: "南京",
    province: "江苏",
    country: "中国",
    headimgurl:
      "http://wx.qlogo.cn/mmopen/PiajxSqBRaELAI1aEUyI3lwJdMwibicvlkF8ASmIhicSYg3n29v2yHibmum2ibmvedvuXnrziaBl46mnrZe6Cb4pSMaXw/0",
    subscribe_time: 1431691451,
  },
  {
    subscribe: 0,
    openid: "o7Zv3s5yjT2MDIICMZkcvcvcvLG71dyBDlg",
    nickname: "name3",
    sex: 1,
    language: "zh_CN",
    city: "浦东新区",
    province: "上海",
    country: "中国",
    headimgurl:
      "http://wx.qlogo.cn/mmopen/PiajxSqBRaELt5V5lD4ficPFvT2Z0ZDOHKc26BHh43NXT41WKFQUzLcdtgvBWn1jcqDSac1ib8PpsezuicNVVcbcicA/0",
    subscribe_time: 1442406029,
  },
];

function Testxcel(props) {
  return (
    <div>
      <button
        className="btn btn-primary"
        onClick={() => exportToExcel(sampleData)}
      >
        djlksjf
      </button>
    </div>
  );
}

export default Testxcel;
