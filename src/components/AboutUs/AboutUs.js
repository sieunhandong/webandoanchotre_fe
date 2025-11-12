import React, { useEffect, useRef, useState } from 'react';

const AboutUs = () => {
  // const [visibleSections, setVisibleSections] = useState(new Set());
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // const section = entry.target.dataset.section;
            const cardId = entry.target.dataset.cardId;

            // if (section) {
            //   setVisibleSections(prev => new Set([...prev, section]));
            // }

            if (cardId) {
              setAnimatedCards(prev => new Set([...prev, cardId]));
            }
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    const elements = document.querySelectorAll('[data-section], [data-card-id]');
    elements.forEach(element => observerRef.current.observe(element));

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const [animatedCards, setAnimatedCards] = useState(new Set());

  const values = [
    {
      title: "Dinh dưỡng khoa học",
      description: "Đội ngũ chuyên gia dinh dưỡng và đầu bếp của TinyYummy nghiên cứu và phát triển thực đơn ăn dặm cân bằng, đáp ứng nhu cầu dinh dưỡng theo từng độ tuổi của bé."
    },
    {
      title: "Nguyên liệu sạch - An toàn",
      description: "Chúng tôi cam kết sử dụng 100% nguyên liệu organic, nguồn gốc rõ ràng, không chất bảo quản, không hóa chất độc hại, đảm bảo an toàn tuyệt đối cho bé yêu."
    },
    {
      title: "Quy trình chuẩn HACCP",
      description: "Nhà bếp TinyYummy tuân thủ nghiêm ngặt quy trình HACCP quốc tế, từ khâu chọn nguyên liệu, chế biến đến đóng gói, đảm bảo vệ sinh an toàn thực phẩm."
    }
  ];

  const products = [
    {
      name: "Cháo dinh dưỡng",
      image: "/banner1.jpg"
    },
    {
      name: "Bột ăn dặm",
      image: "/bot.jpg"
    },
    {
      name: "Snack healthy",
      image: "/snack.jpg"
    }
  ];

  const materials = [
    {
      name: "Gạo lứt hữu cơ",
      description: "Gạo lứt organic giàu chất xơ và vitamin, giúp bé phát triển hệ tiêu hóa khỏe mạnh. Nguồn gốc từ các nông trại hữu cơ được chứng nhận.",
      image: "/materials1.jpg"
    },
    {
      name: "Rau củ tươi",
      description: "Rau củ quả tươi mỗi ngày từ vườn, giàu vitamin và khoáng chất thiết yếu. Được thu hoạch vào buổi sáng sớm để đảm bảo độ tươi ngon tối đa.",
      image: "/materials2.jpg"
    },
    {
      name: "Thịt cá sạch",
      description: "Thịt, cá tươi sống được chọn lọc kỹ càng, cung cấp protein chất lượng cao. Nguồn cung ứng uy tín, đảm bảo không hormone, không kháng sinh.",
      image: "/materials3.jpg"
    }
  ];

  const stats = [
    {
      title: "Tầm nhìn",
      content: "Trở thành thương hiệu ăn dặm hàng đầu Việt Nam, đồng hành cùng hàng triệu gia đình trong hành trình nuôi dưỡng thế hệ trẻ khỏe mạnh, thông minh.",
      image: "/stats1.jpg"
    },
    {
      title: "Sứ mệnh",
      content: "Mang đến những bữa ăn dặm dinh dưỡng, an toàn tuyệt đối từ nguyên liệu hữu cơ, giúp bé phát triển toàn diện về thể chất và trí tuệ.",
      image: "/stats2.jpg"
    },
    {
      title: "Giá trị cốt lõi",
      content: "An toàn - Chất lượng - Tận tâm. Chúng tôi đặt sức khỏe của bé lên hàng đầu với quy trình sản xuất nghiêm ngặt và dịch vụ chăm sóc khách hàng chu đáo.",
      image: "/stats3.jpg"
    }
  ];
  const philosophyItems = [
    { text: "Dinh dưỡng cân bằng", bg: "#E6E6FA", color: "#666" },
    { text: "", bg: "", image: "/aboutus1.jpg" },
    { text: "Đảm bảo an toàn", bg: "#95caf5ff", color: "#fff" },
    { text: "", bg: "", image: "/aboutus2.jpg" },
    { text: "HEALTHY & YUMMY\nBổ dưỡng và ngon miệng", bg: "#FFDAB9", color: "#fff" },
    { text: "", bg: "", image: "/raucu.jpg" },
    { text: "An toàn - Sạch - Tươi", bg: "#A8E6CF", color: "#fff" },
    { text: "", bg: "", image: "/thitca.jpg" },
    { text: "Phát triển toàn diện", bg: "#FFB6D9", color: "#fff" }
  ];

  return (
    <div style={styles.wrapper}>
      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.heroBgElements}>
          <div style={{ ...styles.floatingShape, ...styles.shape1 }}></div>
          <div style={{ ...styles.floatingShape, ...styles.shape2 }}></div>
          <div style={{ ...styles.floatingShape, ...styles.shape3 }}></div>
        </div>

        <div style={styles.heroContainer} className="hero-container">
          {/* Ảnh bên trái */}
          <div style={styles.sideImage} className="side-image">
            <img
              src="/model_1.png"
              alt="Baby food left"
              style={styles.heroImg}
              className="hero-img"
            />
          </div>

          {/* Nội dung ở giữa */}
          <div style={styles.heroContent}>
            <h1 style={styles.mainTitle} className="main-title">
              TinyYummy
            </h1>

            <p style={styles.mainTitleSpan} className="main-title-span">
              Dinh dưỡng từ tình yêu thương
            </p>
            <div className="hero-description" style={styles.heroDescription}>
              <p style={{ margin: '0 0 0.5em', whiteSpace: 'nowrap' }}>
                Bé yêu của bạn đang bước vào giai đoạn quan trọng nhất - giai đoạn ăn dặm.
              </p>
              <p style={{ margin: '0 0 0.5em', whiteSpace: 'nowrap' }}>
                TinyYummy hiểu rằng, mỗi thìa cháo,
              </p>
              <p style={{ margin: '0 0 0.5em', whiteSpace: 'nowrap' }}>
                mỗi miếng bột không chỉ là thức ăn, mà là nền tảng cho sự phát triển toàn diện của bé.
              </p>
              <p style={{ margin: '0 0 0.5em', whiteSpace: 'nowrap' }}>
                Chúng tôi cam kết mang đến những bữa ăn dặm dinh dưỡng, an toàn
              </p>
              <p style={{ margin: '0 0 0.5em', whiteSpace: 'nowrap' }}>
                và ngon miệng, giúp bé khỏe mạnh và phát triển tốt nhất.
              </p>
            </div>
          </div>

          {/* Ảnh bên phải */}
          <div style={styles.sideImage} className="side-image side-image-right">
            <img
              src="/model_2.png"
              alt="Baby food right"
              style={styles.heroImg}
              className="hero-img"
            />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section
        style={styles.valuesSection}
        data-section="values"
      >
        <div style={styles.container}>
          <h2 style={{ ...styles.sectionTitle, color: '#72CCF1' }}>Cam Kết Của TinyYummy</h2>
          <div style={styles.valuesGrid}>
            {values.map((value, index) => (
              <div
                key={index}
                data-card-id={`value-${index}`}
                className="value-card"
                style={{
                  ...styles.valueCard,
                  opacity: animatedCards.has(`value-${index}`) ? 1 : 0,
                  transform: animatedCards.has(`value-${index}`) ? 'translateY(0)' : 'translateY(50px)',
                  transition: 'all 0.8s ease-out',
                  transitionDelay: `${index * 0.15}s`
                }}
              >
                <h3 style={styles.valueCardTitle}>{value.title}</h3>
                <p style={styles.valueCardText}>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section style={styles.philosophySection} data-section="philosophy">
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>TRIẾT LÝ DINH DƯỠNG</h2>
          <div style={styles.philosophyGrid}>
            {philosophyItems.map((item, index) => (
              <div
                key={index}
                data-card-id={`philosophy-${index}`}
                className="philosophy-item"
                style={{
                  ...styles.philosophyItem,
                  background: item.image
                    ? `url(${item.image}) center/cover`
                    : item.bg,
                  color: item.color || '#fff',
                  opacity: animatedCards.has(`philosophy-${index}`) ? 1 : 0,
                  transform: animatedCards.has(`philosophy-${index}`) ? 'scale(1)' : 'scale(0.8)',
                  transition: 'all 0.6s ease-out',
                  transitionDelay: `${index * 0.1}s`
                }}
              >
                {item.text && item.text.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < item.text.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section
        style={styles.productsSection}
        data-section="products"
      >
        <div style={styles.container}>
          <h2
            data-card-id="products-title"
            style={{
              ...styles.sectionTitle,
              color: '#72CCF1',
              opacity: animatedCards.has('products-title') ? 1 : 0,
              transform: animatedCards.has('products-title') ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.8s ease-out'
            }}
          >
            Sản Phẩm TinyYummy
          </h2>
          <p
            data-card-id="products-subtitle"
            style={{
              ...styles.productsSubtitle,
              opacity: animatedCards.has('products-subtitle') ? 1 : 0,
              transform: animatedCards.has('products-subtitle') ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.8s ease-out',
              transitionDelay: '0.2s'
            }}
          >
            "Chúng tôi tự hào mang đến thực đơn ăn dặm đa dạng, phù hợp với từng giai đoạn phát triển của bé,
            từ 6 tháng tuổi cho đến 3 tuổi."
          </p>
          <div style={styles.productsGrid}>
            {products.map((product, index) => (
              <div
                key={index}
                data-card-id={`product-${index}`}
                className="product-card"
                style={{
                  ...styles.productCard,
                  opacity: animatedCards.has(`product-${index}`) ? 1 : 0,
                  transform: animatedCards.has(`product-${index}`) ? 'translateY(0)' : 'translateY(50px)',
                  transition: 'all 0.8s ease-out',
                  transitionDelay: `${index * 0.15}s`
                }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  style={styles.productImg}
                />
                <span style={styles.productName}>{product.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Materials Section */}
      <section
        style={styles.materialsSection}
        data-section="materials"
      >
        <div style={styles.container}>
          <h2
            data-card-id="materials-title"
            style={{
              ...styles.sectionTitle,
              opacity: animatedCards.has('materials-title') ? 1 : 0,
              transform: animatedCards.has('materials-title') ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.8s ease-out'
            }}
          >
            NGUYÊN LIỆU CHỌN LỌC
          </h2>
          <p
            data-card-id="materials-subtitle"
            style={{
              ...styles.materialsSubtitle,
              opacity: animatedCards.has('materials-subtitle') ? 1 : 0,
              transform: animatedCards.has('materials-subtitle') ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.8s ease-out',
              transitionDelay: '0.2s'
            }}
          >
            100% nguyên liệu hữu cơ, tươi sạch mỗi ngày
          </p>
          <div style={styles.materialsGrid}>
            {materials.map((material, index) => (
              <div
                key={index}
                data-card-id={`material-${index}`}
                style={{
                  ...styles.materialCard,
                  opacity: animatedCards.has(`material-${index}`) ? 1 : 0,
                  transform: animatedCards.has(`material-${index}`) ? 'translateX(0)' : 'translateX(-50px)',
                  transition: 'all 0.8s ease-out',
                  transitionDelay: `${index * 0.15}s`
                }}
              >
                <img
                  src={material.image}
                  alt={material.name}
                  style={styles.materialImg}
                />
                <div style={styles.materialContent}>
                  <h3 style={styles.materialTitle}>
                    <span style={styles.materialSpan}>{material.name}</span>
                  </h3>
                  <p style={styles.materialText}>{material.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        style={styles.statsSection}
        data-section="stats"
      >
        <div style={styles.containerStats}>
          <h2
            data-card-id="stats-title"
            style={{
              ...styles.sectionTitle,
              color: '#72CCF1',
              opacity: animatedCards.has('stats-title') ? 1 : 0,
              transform: animatedCards.has('stats-title') ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.8s ease-out'
            }}
          >
            Về TinyYummy
          </h2>
          <p
            data-card-id="stats-subtitle"
            style={{
              ...styles.statsSubtitle,
              opacity: animatedCards.has('stats-subtitle') ? 1 : 0,
              transform: animatedCards.has('stats-subtitle') ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.8s ease-out',
              transitionDelay: '0.2s'
            }}
          >
            TinyYummy - Thương hiệu ăn dặm uy tín, đồng hành cùng hàng ngàn gia đình Việt trong hành trình nuôi dưỡng con yêu khỏe mạnh, thông minh từ những bữa ăn đầu đời.
          </p>
          <div style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <div
                key={index}
                data-card-id={`stat-${index}`}
                style={{
                  ...styles.statCard,
                  opacity: animatedCards.has(`stat-${index}`) ? 1 : 0,
                  transform: animatedCards.has(`stat-${index}`) ? 'translateY(0)' : 'translateY(50px)',
                  transition: 'all 0.8s ease-out',
                  transitionDelay: `${index * 0.2}s`
                }}
              >
                <img
                  src={stat.image}
                  alt={stat.title}
                  style={styles.statImage}
                />
                <div style={styles.statContent}>
                  <h3 style={styles.statTitle}>{stat.title}</h3>
                  <p style={styles.statText}>{stat.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <style>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0) rotate(0deg); 
          }
          25% {
            transform: translateY(-20px) rotate(5deg);
          }
          50% { 
            transform: translateY(-30px) rotate(10deg); 
          }
          75% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes countUp {
          from { 
            opacity: 0; 
            transform: translateY(20px) scale(0.5); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.8) rotate(-5deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes rotateIn {
          0% {
            opacity: 0;
            transform: rotate(-200deg) scale(0);
          }
          100% {
            opacity: 1;
            transform: rotate(0) scale(1);
          }
        }

        @keyframes flipIn {
          0% {
            transform: perspective(400px) rotateX(90deg);
            opacity: 0;
          }
          40% {
            transform: perspective(400px) rotateX(-10deg);
          }
          70% {
            transform: perspective(400px) rotateX(10deg);
          }
          100% {
            transform: perspective(400px) rotateX(0deg);
            opacity: 1;
          }
        }

@keyframes floatUpDown {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-15px);
  }
}

        /* Hover Effects */
        .value-card:hover {
          animation: pulse 0.6s ease-in-out;
        }

        .philosophy-item:hover {
          animation: pulse 0.5s ease-in-out;
        }

        .product-card:hover img {
          transform: scale(1.1) rotate(2deg);
        }

        .material-card:hover {
          transform: translateY(-15px) rotate(1deg);
          box-shadow: 0 25px 70px rgba(114, 204, 241, 0.4);
        }

        /* Shimmer Effect on Hover */
        .hero-img:hover {
          animation: shimmer 1.5s infinite;
        }

        /* Parallax Effect */
        @keyframes parallaxFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .floating-shape {
          animation: float 20s infinite ease-in-out;
        }

        .shape-1 {
          animation: float 15s infinite ease-in-out;
        }

        .shape-2 {
          animation: float 20s infinite ease-in-out reverse;
        }

        .shape-3 {
          animation: float 18s infinite ease-in-out;
        }

        /* Text Gradient Animation */
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .main-title span {
          background: linear-gradient(90deg, #FFB6D9, #FFDAB9, #FFB6D9);
          background-size: 200% auto;
          animation: gradientShift 3s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Stagger Animation for Grid Items */
        .philosophy-item {
          animation: fadeInScale 0.8s ease-out backwards;
        }

        .philosophy-item:nth-child(1) { animation-delay: 0.1s; }
        .philosophy-item:nth-child(2) { animation-delay: 0.2s; }
        .philosophy-item:nth-child(3) { animation-delay: 0.3s; }
        .philosophy-item:nth-child(4) { animation-delay: 0.4s; }
        .philosophy-item:nth-child(5) { animation-delay: 0.5s; }
        .philosophy-item:nth-child(6) { animation-delay: 0.6s; }
        .philosophy-item:nth-child(7) { animation-delay: 0.7s; }
        .philosophy-item:nth-child(8) { animation-delay: 0.8s; }
        .philosophy-item:nth-child(9) { animation-delay: 0.9s; }

        /* Smooth Scroll Behavior */
        html {
          scroll-behavior: smooth;
        }

        /* Loading State */
        @keyframes skeletonLoading {
          0% {
            background-position: -200px 0;
          }
          100% {
            background-position: calc(200px + 100%) 0;
          }
        }

        /* Glow Effect */
        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(114, 204, 241, 0.4);
          }
          50% {
            box-shadow: 0 0 40px rgba(114, 204, 241, 0.8);
          }
        }

        .stat-number {
          animation: countUp 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        }

        /* Mobile Optimization */
        @media (max-width: 768px) {
          .philosophy-grid, .products-grid, .stats-grid {
            grid-template-columns: 1fr !important;
          }

          .hero-img {
            width: 150px !important;
            height: 150px !important;
          }

          .main-title {
            font-size: 2rem !important;
          }

          .section-title {
            font-size: 1.8rem !important;
          }

          .stat-number {
            font-size: 3rem !important;
          }
        }

        /* Reduce Motion for Accessibility */
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
@media (max-width: 1200px) {
  .hero-container {
    gap: 25px !important;
    padding: 0 30px !important;
  }

  .side-image {
    flex: 0 0 350px !important;
  }

  .hero-img {
    width: 350px !important;
    height: 450px !important;
  }

  .main-title {
    font-size: 2.3rem !important;
  }

  .main-title-span {
    font-size: 1.5rem !important;
  }

  .hero-subtitle {
    font-size: 1.2rem !important;
  }

  .hero-description {
  font-size: 0.9rem !important;
}

.hero-description p {
  font-size: 0.9rem !important;
}
}

@media (max-width: 900px) {
  .hero-container {
    flex-direction: column !important;
    gap: 40px !important;
    padding: 0 20px !important;
  }

  .side-image {
    flex: 0 0 auto !important;
  }

  .hero-img {
    width: 350px !important;
    height: 450px !important;
  }

  .main-title {
    font-size: 2rem !important;
  }

  .main-title-span {
    font-size: 1.3rem !important;
  }

  .hero-subtitle {
    font-size: 1.05rem !important;
  }

  .hero-description {
  font-size: 0.85rem !important;
  text-align: center !important;
}

.hero-description p {
  font-size: 0.85rem !important;
}
    .stat-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 60px rgba(114, 204, 241, 0.3);
}

.stat-card:hover img {
  transform: scale(1.05);
}
  .stats-grid {
    grid-template-columns: 1fr !important;
    gap: 30px !important;
  }
}
@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 30px !important;
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr !important;
    gap: 25px !important;
  }
  
  .stat-card {
    max-width: 500px;
    margin: 0 auto;
  }
}
@media (max-width: 600px) {
  .hero-img {
    width: 280px !important;
    height: 360px !important;
  }

  .main-title {
    font-size: 1.7rem !important;
  }

  .main-title-span {
    font-size: 1.1rem !important;
  }

  .hero-subtitle {
    font-size: 0.95rem !important;
  }

  .hero-description {
  font-size: 0.7rem !important;
  padding: 0 10px !important;
}

.hero-description p {
  font-size: 0.7rem !important;
}
}

@media (max-width: 480px) {
  .side-image-right {
    display: none !important;
  }

  .hero-img {
    width: 200px !important;
    height: 280px !important;
  }

  .main-title {
    font-size: 1.5rem !important;
  }
    @media (max-width: 400px) {
  .hero-description {
    font-size: 0.65rem !important;
  }
  
  .hero-description p {
    font-size: 0.65rem !important;
  }
}
}
        /* Custom Easing Functions */
        .value-card {
          transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .product-card {
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .material-card {
          transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
      `}</style>
    </div>
  );
};

const styles = {
  wrapper: {
    overflowX: 'hidden',
    background: '#fff',
    color: '#333'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px'
  },
  heroSection: {
    position: 'relative',
    minHeight: '70vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#fcf3ec',
    overflow: 'hidden',
  },
  heroContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: '1800px',
    margin: '0 auto',
    gap: '30px',
    position: 'relative',
    zIndex: 10
  },
  sideImage: {
    flex: '0 0 450px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroBgElements: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    overflow: 'hidden'
  },
  floatingShape: {
    position: 'absolute',
    opacity: 0.1,
    animation: 'float 20s infinite ease-in-out'
  },
  shape1: {
    width: '300px',
    height: '300px',
    background: '#FFB6D9',
    borderRadius: '50%',
    top: '10%',
    left: '-100px',
    animationDelay: '0s'
  },
  shape2: {
    width: '200px',
    height: '200px',
    background: '#FFDAB9',
    borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
    top: '60%',
    right: '-50px',
    animationDelay: '3s'
  },
  shape3: {
    width: '150px',
    height: '150px',
    background: '#E6E6FA',
    borderRadius: '50%',
    bottom: '20%',
    left: '10%',
    animationDelay: '6s'
  },
  heroContent: {
    flex: '1',
    position: 'relative',
    zIndex: 10,
    textAlign: 'center',
    animation: 'fadeInUp 1s ease-out',
    paddingBottom: '70px',
    maxWidth: '800px'
  },
  heroImages: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginBottom: '40px',
    flexWrap: 'wrap'
  },
  heroImg: {
    width: '450px',
    height: '550px',
    objectFit: 'contain',
    objectPosition: 'center',
    animation: 'floatUpDown 3s ease-in-out infinite',
    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
  mainTitle: {
    fontSize: '5.5rem',
    fontWeight: 700,
    color: '#4b4b4b',
    marginBottom: '15px',
    textShadow: '3px 3px 6px rgba(0,0,0,0.2)',
    lineHeight: 1.2,
  },

  mainTitleSpan: {
    display: 'block',
    // color: "beige",
    fontSize: '3.2rem',
    marginTop: '0',
    marginBottom: '25px',
    background: 'linear-gradient(90deg, #72CCF1, #f97eda)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontWeight: 600,
    lineHeight: 1.3,
  },

  heroSubtitle: {
    fontSize: '1.5rem',
    color: '#fff',
    marginBottom: '30px',
    opacity: 0.95,
    fontWeight: 600,
    lineHeight: 1.4,
  },

  heroDescription: {
    maxWidth: '700px',
    margin: '0 auto',
    fontSize: '1.05rem',
    lineHeight: 1.9,
    color: '#000000',
    opacity: 0.92,
    textAlign: 'center',
  },
  valuesSection: {
    padding: '100px 0',
    background: '#f8f9fa'
  },
  sectionTitle: {
    textAlign: 'center',
    fontSize: '3.2rem',
    color: '#fff',
    marginBottom: '60px',
    textTransform: 'uppercase',
    letterSpacing: '2px',
  },
  valuesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '40px',
    marginTop: '60px'
  },
  valueCard: {
    background: '#fff',
    padding: '40px 30px',
    borderRadius: '20px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
    transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden'
  },
  valueCardTitle: {
    fontSize: '1.5rem',
    color: '#72CCF1',
    marginBottom: '15px'
  },
  valueCardText: {
    lineHeight: 1.8,
    color: '#666'
  },
  philosophySection: {
    padding: '100px 0',
    background: 'linear-gradient(135deg, #FFB6D9 0%, #FFDAB9 100%)'
  },
  philosophyGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px'
  },
  philosophyItem: {
    aspectRatio: '1',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.1rem',
    fontWeight: 600,
    textAlign: 'center',
    padding: '20px',
    transition: 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 5px 20px rgba(0,0,0,0.1)'
  },
  productsSection: {
    padding: '100px 0',
    background: '#fff'
  },
  productsSubtitle: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#666',
    marginBottom: '40px'
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '30px',
    marginTop: '60px'
  },
  productCard: {
    textAlign: 'center',
    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    cursor: 'pointer',
    position: 'relative'
  },
  productImg: {
    width: '100%',
    height: '250px',
    objectFit: 'cover',
    borderRadius: '20px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
    transition: 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  },
  productName: {
    display: 'block',
    marginTop: '20px',
    fontSize: '1.2rem',
    fontWeight: 600,
    color: '#72CCF1'
  },
  materialsSection: {
    padding: '100px 0',
    background: 'linear-gradient(135deg, #A8E6CF 0%, #72CCF1 100%)'
  },
  materialsSubtitle: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#fff',
    marginBottom: '40px'
  },
  materialsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '30px',
    marginTop: '60px'
  },
  materialCard: {
    background: '#fff',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
    transition: 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    cursor: 'pointer',
    position: 'relative'
  },
  materialImg: {
    width: '100%',
    height: '200px',
    objectFit: 'cover'
  },
  materialContent: {
    padding: '30px'
  },
  materialTitle: {
    fontSize: '1.5rem',
    color: '#72CCF1',
    marginBottom: '15px'
  },
  materialSpan: {
    fontWeight: 600,
    color: '#72CCF1'
  },
  materialText: {
    lineHeight: 1.8,
    color: '#666'
  },
  containerStats: {
    maxWidth: '1600px',
    margin: '0 auto',
    padding: '0 20px'
  },
  statsSection: {
    padding: '100px 0',
    background: '#fff'
  },
  statsSubtitle: {
    textAlign: 'center',
    fontSize: '1.1rem',
    color: '#666',
    marginBottom: '60px',
    maxWidth: '900px',
    margin: '0 auto 60px',
    lineHeight: 1.8
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '40px',
    marginTop: '60px'
  },
  statCard: {
    background: '#fff',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
    transition: 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    cursor: 'pointer',
    position: 'relative'
  },
  statImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    transition: 'transform 0.5s ease'
  },
  statContent: {
    padding: '30px'
  },
  statTitle: {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: '#72CCF1',
    marginBottom: '15px',
    textAlign: 'center'
  },
  statText: {
    fontSize: '0.95rem',
    lineHeight: 1.8,
    color: '#666',
    textAlign: 'center'
  }
};

export default AboutUs;