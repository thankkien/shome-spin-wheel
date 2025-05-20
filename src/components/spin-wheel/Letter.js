import { useAuthStore } from "@/stores";

const letters = [
  {
    id: "male-spring",
    content: `{fullname} thân mến,

Chúng mình đã gặp nhau vào một ngày mùa xuân nắng ấm. Chính sự năng động, tinh nghịch cùng tinh thần lạc quan của bạn đã góp phần làm màu mỡ thêm cho mảnh đất này trong suốt {day} ngày qua.

Mong rằng ở chặng đường phía trước, S.Home sẽ luôn có bạn đồng hành để chúng ta cùng nhau tạo nên những mùa xuân tuyệt vời nhất.

Cảm ơn bạn và thật tự hào khi có bạn sánh vai.`,
  },
  {
    id: "male-summer",
    content: `{fullname} ơi,

Chúc mừng {day} ngày chúng mình có nhau.

Gọi bạn là mùa hè vì chúng mình đến với nhau vào một ngày hè nóng bỏng. Chính nhiệt huyết và sự sôi nổi của bạn đã góp phần thổi bùng lên ngọn lửa trẻ trung cho nơi này.

Hãy tiếp tục giữ vững ngọn lửa ấy để cùng S.Home vươn tầm cao mới trong tương lai nhé!

Cảm ơn bạn và thật yên tâm biết mấy khi có bạn ở đây.`,
  },
  {
    id: "male-fall",
    content: `{fullname} thân mến,

Chúng mình gặp nhau vào một ngày thu mát mẻ.
Sự thân thiện và tinh tế của bạn đã tạo nên một màu sắc đặc biệt trong vũ trụ đa sắc màu này.

Cảm ơn bạn vì đã đến và cùng chúng mình hoàn thiện bức tranh sặc sỡ mang tên S.Home trong suốt {day} ngày qua.

S.Home rất vui khi được đồng hành cùng bạn trong chặng đường phía trước.`,
  },
  {
    id: "male-winter",
    content: `{fullname} thân mến,

Cảm ơn bạn vì đã đồng hành, cống hiến và không ngừng mang lại những giá trị tuyệt vời cho khách hàng, đồng nghiệp và công ty trong suốt {day} ngày qua.

Mong bạn sẽ luôn giữ vững ngọn lửa nhiệt huyết của mình để cùng S.Home chinh phục nhiều mục tiêu lớn hơn nữa trong tương lai.

S.Home thực sự may mắn và tự hào vì có bạn kề bên!`,
  },
  {
    id: "female-spring",
    content: `{fullname} xinh đẹp ơi,

Cảm ơn nàng vì đã trở thành một phần của S.Home vào một ngày xuân ấm áp. Nàng biết không, trong suốt {day} ngày bên nhau vừa qua, sự tự tin, năng động của nàng đã tiếp thêm rất nhiều cảm hứng tích cực cho chúng mình vào mỗi ngày đi làm đấy.

Hãy luôn thật xinh đẹp và tự tin như đóa hoa mùa xuân nàng nhé!

S.Home thật may mắn vì có nàng ở đây.`,
  },
  {
    id: "female-summer",
    content: `Xin chào cô gái mùa hạ,
{fullname}

Gọi bạn là “cô gái mùa hạ” vì chúng mình gặp nhau lần đầu vào một ngày hè rực rỡ.
Sự xuất hiện của bạn đã mang tới một làn gió mới mẻ, tinh khôi và đầy ắp sự hứng khởi cho mảnh đất vốn “dương thịnh” này.

Chúc mừng chặng đường {day} ngày bên nhau của chúng ta.
Cảm ơn bạn và thật hạnh diện biết bao khi có bạn đi cùng.`,
  },
  {
    id: "female-fall",
    content: `{fullname} ơi,

Bạn biết không, với S.Home, mùa thu năm nào cũng thật đặc biệt. Không phải vì đây là dịp S.Home được ngắm nhìn 1 thời tiết nhẹ nhàng mà là vì chúng mình đã gặp gỡ và đến với nhau vào mùa thu. Chúc mừng chặng đường {day} ngày có nhau của chúng ta.

Cảm ơn bạn vì đã đến đây vào mùa thu để chúng mình có thể ở bên nhau trong suốt những mùa đông sau đó!

Gửi tới bạn trọn vẹn tình yêu và niềm tự hào từ S.Home.`,
  },
  {
    id: "female-winter",
    content: `{fullname} thân mến,

Dù chúng mình đến với nhau vào một ngày mùa đông se lạnh nhưng sự ngọt ngào và ấm áp của bạn đã góp phần sưởi ấm mảnh đất này trong suốt {day} ngày qua.

Cảm ơn bạn vì đã là một phần không thể thiếu của S.Home.
S.Home tự hào vì có bạn.`,
  },
];

export default function Letter({ onClick }) {
  const user = useAuthStore((state) => state.user);
  const letter = letters.find(
    (letter) => letter.id === `${user.gender}-${user.season}`
  );
  return (
    <div
      className="flex flex-col items-center justify-center bg-transparent my-6 mx-4"
      onClick={onClick}
    >
      <p className="text-lg text-gray-800 text-center whitespace-pre-line font-(family-name:--font-dancing-script)">
        {letter.content.replace("{fullname}", user.fullname).replace("{day}", user.workday)}
      </p>
    </div>
  );
}
