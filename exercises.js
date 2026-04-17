// exercises.js — Banco de dados completo de exercícios para Simone Trombini
const EXERCISE_DB = {
  1: { // Segunda - Peito + Tríceps
    dayName: 'Peito + Tríceps',
    dayLabel: 'Segunda-feira',
    icon: '💪',
    exercises: [
      {
        id: 'd1e1',
        name: 'Flexão na Parede',
        muscleGroup: 'Peito',
        sets: 3,
        reps: 12,
        isometric: false,
        equipment: 'Parede lisa',
        startPosition: 'Fique de pé, a cerca de um braço de distância da parede. Coloque as mãos na parede na altura dos ombros, um pouco mais afastadas que a largura dos ombros. Pés juntos ou levemente afastados.',
        execution: '1. Flexione os cotovelos e leve o peito em direção à parede, mantendo o corpo reto como uma tábua.\n2. Toque levemente o nariz ou o queixo na parede.\n3. Empurre a parede para voltar à posição inicial.\n4. Mantenha o abdômen contraído durante todo o movimento.',
        breathing: 'Inspire ao descer em direção à parede. Expire ao empurrar e voltar.',
        caution: '⚠️ Mantenha os punhos alinhados — não deixe as mãos muito baixas para não forçar os ombros. Se sentir desconforto no pescoço, afaste os pés um pouco mais da parede para reduzir a carga.',
        imageUrl: 'exercises/flexao-parede.svg'
      },
      {
        id: 'd1e2',
        name: 'Supino no Chão com Garrafas',
        muscleGroup: 'Peito',
        sets: 3,
        reps: 12,
        isometric: false,
        equipment: '2 garrafas (500ml ou 1L)',
        startPosition: 'Deite-se de costas no chão (use um tapete ou colchonete). Joelhos dobrados, pés apoiados no chão. Segure uma garrafa em cada mão com as palmas viradas para frente, cotovelos no chão formando um "T" com o corpo.',
        execution: '1. Empurre as garrafas para cima até os braços ficarem quase esticados (não trave os cotovelos).\n2. Segure por 1 segundo no topo.\n3. Desça lentamente até os cotovelos tocarem o chão.\n4. Repita sem pressa.',
        breathing: 'Expire ao empurrar para cima. Inspire ao descer.',
        caution: '⚠️ Não trave os cotovelos no topo. Apoie bem a cabeça no chão — se o pescoço incomodar, coloque uma toalha dobrada sob a nuca.',
        imageUrl: 'exercises/supino-chao.svg'
      },
      {
        id: 'd1e3',
        name: 'Crucifixo no Chão com Garrafas',
        muscleGroup: 'Peito',
        sets: 2,
        reps: 12,
        isometric: false,
        equipment: '2 garrafas (500ml ou 1L)',
        startPosition: 'Mesma posição do supino: deitada de costas, joelhos dobrados. Segure as garrafas com braços estendidos acima do peito, palmas se olhando.',
        execution: '1. Abra os braços para os lados em arco, como se fosse abraçar uma bola grande.\n2. Desça até os cotovelos quase tocarem o chão (leve flexão nos cotovelos).\n3. Volte ao centro apertando o peito.\n4. Movimento lento e controlado.',
        breathing: 'Inspire ao abrir os braços. Expire ao fechar.',
        caution: '⚠️ Não desça demais — pare quando sentir um leve alongamento no peito. Mantenha uma leve flexão nos cotovelos para proteger a articulação.',
        imageUrl: 'exercises/crucifixo-chao.svg'
      },
      {
        id: 'd1e4',
        name: 'Tríceps na Cadeira',
        muscleGroup: 'Tríceps',
        sets: 3,
        reps: 10,
        isometric: false,
        equipment: 'Cadeira firme (sem rodinhas)',
        startPosition: 'Sente-se na beira de uma cadeira firme. Coloque as mãos na borda da cadeira ao lado do quadril, dedos para frente. Deslize o quadril para fora da cadeira, pernas dobradas a 90°.',
        execution: '1. Flexione os cotovelos e desça o quadril em direção ao chão.\n2. Desça até os cotovelos formarem cerca de 90° (não precisa ir mais fundo).\n3. Empurre para cima até os braços ficarem quase esticados.\n4. Mantenha as costas próximas à cadeira.',
        breathing: 'Inspire ao descer. Expire ao empurrar para cima.',
        caution: '⚠️ Não desça demais para não sobrecarregar os ombros. Certifique-se que a cadeira está firme e não vai escorregar. Se o joelho direito incomodar, estenda a perna direita para reduzir a pressão.',
        imageUrl: 'exercises/triceps-cadeira.svg'
      },
      {
        id: 'd1e5',
        name: 'Extensão de Tríceps com Garrafa',
        muscleGroup: 'Tríceps',
        sets: 2,
        reps: 12,
        isometric: false,
        equipment: '1 garrafa (1L)',
        startPosition: 'Sentada ou em pé. Segure uma garrafa com uma mão, eleve o braço acima da cabeça com o cotovelo apontando para o teto.',
        execution: '1. Flexione o cotovelo, descendo a garrafa atrás da cabeça.\n2. Mantenha o cotovelo apontando para cima (não deixe abrir para o lado).\n3. Estenda o braço de volta para cima.\n4. Faça todas as reps de um lado, depois troque.',
        breathing: 'Inspire ao descer a garrafa. Expire ao estender o braço.',
        caution: '⚠️ Faça devagar para não forçar a cervical. Se sentir dor no pescoço, use a outra mão para apoiar o cotovelo do braço que está trabalhando. Use garrafa leve.',
        imageUrl: 'exercises/extensao-triceps.svg'
      }
    ]
  },
  2: { // Terça - Glúteos + Posteriores
    dayName: 'Glúteos + Posteriores',
    dayLabel: 'Terça-feira',
    icon: '🍑',
    exercises: [
      {
        id: 'd2e1',
        name: 'Elevação de Quadril (Ponte)',
        muscleGroup: 'Glúteos',
        sets: 3,
        reps: 15,
        isometric: false,
        equipment: 'Tapete ou colchonete',
        startPosition: 'Deite de costas no chão, joelhos dobrados, pés apoiados no chão na largura do quadril. Braços ao lado do corpo, palmas para baixo.',
        execution: '1. Aperte os glúteos e eleve o quadril do chão até o corpo formar uma linha reta dos ombros aos joelhos.\n2. Segure no topo por 2 segundos, apertando bem os glúteos.\n3. Desça lentamente até quase encostar o quadril no chão.\n4. Repita sem apoiar completamente.',
        breathing: 'Expire ao elevar o quadril. Inspire ao descer.',
        caution: '⚠️ Não hiperestenda a lombar no topo — suba apenas até ficar reto. Mantenha os pés bem apoiados. Se o joelho direito doer, afaste os pés um pouco mais do corpo.',
        imageUrl: 'exercises/ponte-gluteo.svg'
      },
      {
        id: 'd2e2',
        name: 'Abdução de Quadril Deitada',
        muscleGroup: 'Glúteos',
        sets: 3,
        reps: 12,
        isometric: false,
        equipment: 'Tapete ou colchonete',
        startPosition: 'Deite-se de lado, pernas esticadas e empilhadas. Apoie a cabeça no braço de baixo. Mão de cima na frente do corpo para equilíbrio.',
        execution: '1. Eleve a perna de cima lentamente, mantendo-a esticada.\n2. Suba até cerca de 45° (não precisa ir alto demais).\n3. Desça lentamente sem encostar na outra perna.\n4. Faça todas as reps e vire para o outro lado.',
        breathing: 'Expire ao elevar a perna. Inspire ao descer.',
        caution: '⚠️ Não gire o quadril para trás. Mantenha o corpo bem alinhado. Se o joelho direito incomodar ao deitar sobre ele, coloque um travesseiro entre as pernas.',
        imageUrl: 'exercises/abducao-quadril.svg'
      },
      {
        id: 'd2e3',
        name: 'Extensão de Quadril (Quatro Apoios)',
        muscleGroup: 'Glúteos / Posteriores',
        sets: 3,
        reps: 12,
        isometric: false,
        equipment: 'Tapete ou colchonete',
        startPosition: 'Posição de quatro apoios: mãos sob os ombros, joelhos sob o quadril. Costas retas (como uma mesa).',
        execution: '1. Mantenha o joelho dobrado a 90° e empurre o pé em direção ao teto.\n2. Suba até a coxa ficar alinhada com as costas.\n3. Segure 1 segundo no topo, apertando o glúteo.\n4. Desça devagar e repita. Troque de perna.',
        breathing: 'Expire ao elevar a perna. Inspire ao descer.',
        caution: '⚠️ Coloque um travesseiro ou toalha dobrada sob o joelho direito para amortecer. Se doer, faça o exercício em pé, segurando numa cadeira, chutando a perna para trás.',
        imageUrl: 'exercises/extensao-quadril.svg'
      },
      {
        id: 'd2e4',
        name: 'Stiff Modificado com Garrafas',
        muscleGroup: 'Posteriores de coxa',
        sets: 3,
        reps: 12,
        isometric: false,
        equipment: '2 garrafas (1L)',
        startPosition: 'Em pé, pés na largura do quadril. Segure uma garrafa em cada mão na frente das coxas. Joelhos levemente flexionados.',
        execution: '1. Incline o tronco para frente, empurrando o quadril para trás (como se fosse fechar uma porta com o bumbum).\n2. Deslize as garrafas pelas coxas até a altura dos joelhos.\n3. Sinta o alongamento na parte de trás das coxas.\n4. Volte à posição inicial apertando os glúteos.',
        breathing: 'Inspire ao descer. Expire ao subir.',
        caution: '⚠️ Mantenha as costas RETAS — nunca arredonde. Não desça além dos joelhos. Flexione levemente os joelhos para proteger a articulação. Se a cervical incomodar, olhe para o chão (não force o pescoço para cima).',
        imageUrl: 'exercises/stiff-modificado.svg'
      },
      {
        id: 'd2e5',
        name: 'Ponte Unilateral (Avançado)',
        muscleGroup: 'Glúteos',
        sets: 2,
        reps: 10,
        isometric: false,
        equipment: 'Tapete ou colchonete',
        startPosition: 'Mesma posição da ponte normal. Estenda uma perna para cima (ou mantenha elevada com joelho dobrado se for mais fácil).',
        execution: '1. Com uma perna apoiada e a outra elevada, eleve o quadril.\n2. Suba até o corpo ficar reto.\n3. Segure 2 segundos no topo.\n4. Desça devagar. Faça todas as reps e troque de perna.',
        breathing: 'Expire ao subir. Inspire ao descer.',
        caution: '⚠️ Se for muito difícil, volte para a ponte com as duas pernas. Comece sempre pela perna mais forte (esquerda) para aquecer. Ao fazer com a perna direita apoiada, preste atenção ao joelho — pare se sentir dor.',
        imageUrl: 'exercises/ponte-unilateral.svg'
      }
    ]
  },
  3: { // Quarta - Costas + Bíceps
    dayName: 'Costas + Bíceps',
    dayLabel: 'Quarta-feira',
    icon: '🏋️',
    exercises: [
      {
        id: 'd3e1',
        name: 'Remada Curvada com Garrafas',
        muscleGroup: 'Costas',
        sets: 3,
        reps: 12,
        isometric: false,
        equipment: '2 garrafas (1L)',
        startPosition: 'Em pé, pés na largura do quadril. Incline o tronco para frente (~45°), joelhos levemente dobrados. Braços esticados para baixo segurando as garrafas.',
        execution: '1. Puxe as garrafas em direção ao umbigo, apertando as escápulas (como se quisesse segurar um lápis entre elas).\n2. Segure 1 segundo no topo.\n3. Desça lentamente.\n4. Mantenha as costas retas o tempo todo.',
        breathing: 'Expire ao puxar. Inspire ao descer.',
        caution: '⚠️ Não arredonde as costas. Olhe para o chão à sua frente para não forçar a cervical. Se a lombar doer, apoie uma mão numa cadeira e faça unilateral.',
        imageUrl: 'exercises/remada-curvada.svg'
      },
      {
        id: 'd3e2',
        name: 'Remada Unilateral na Cadeira',
        muscleGroup: 'Costas',
        sets: 3,
        reps: 12,
        isometric: false,
        equipment: '1 garrafa (1L) + cadeira',
        startPosition: 'Apoie o joelho esquerdo e a mão esquerda numa cadeira. Perna direita esticada atrás, apoiada no chão. Segure a garrafa com a mão direita, braço esticado para baixo.',
        execution: '1. Puxe a garrafa em direção ao quadril, cotovelo rente ao corpo.\n2. Aperte as costas no topo por 1 segundo.\n3. Desça lentamente.\n4. Faça todas as reps e troque de lado.',
        breathing: 'Expire ao puxar. Inspire ao descer.',
        caution: '⚠️ Mantenha as costas retas e paralelas ao chão. Se apoiar o joelho direito na cadeira causar dor, faça em pé com apoio de uma mão na parede.',
        imageUrl: 'exercises/remada-unilateral.svg'
      },
      {
        id: 'd3e3',
        name: 'Puxada com Toalha',
        muscleGroup: 'Costas',
        sets: 3,
        reps: 12,
        isometric: false,
        equipment: 'Toalha grande',
        startPosition: 'Sentada numa cadeira, segure uma toalha esticada acima da cabeça com as duas mãos, mais aberta que os ombros.',
        execution: '1. Puxe a toalha para baixo, levando-a atrás da cabeça em direção à nuca.\n2. Aperte as escápulas ao máximo.\n3. Mantenha 1 segundo embaixo.\n4. Volte lentamente para cima.\n5. Mantenha tensão na toalha o tempo todo (puxando para fora).',
        breathing: 'Expire ao puxar para baixo. Inspire ao subir.',
        caution: '⚠️ Cuidado com a cervical! Não force a toalha contra o pescoço. Se doer, faça o movimento apenas até a altura das orelhas, sem ir atrás da cabeça.',
        imageUrl: 'exercises/puxada-toalha.svg'
      },
      {
        id: 'd3e4',
        name: 'Rosca Bíceps com Garrafas',
        muscleGroup: 'Bíceps',
        sets: 3,
        reps: 12,
        isometric: false,
        equipment: '2 garrafas (500ml ou 1L)',
        startPosition: 'Em pé ou sentada, braços ao lado do corpo, segurando uma garrafa em cada mão com palmas viradas para frente.',
        execution: '1. Flexione os cotovelos, subindo as garrafas em direção aos ombros.\n2. Mantenha os cotovelos colados ao corpo (não deixe balançar).\n3. Segure 1 segundo no topo.\n4. Desça lentamente.',
        breathing: 'Expire ao subir. Inspire ao descer.',
        caution: '⚠️ Não balance o corpo para ajudar. Se os punhos doerem, segure as garrafas com as palmas viradas para dentro (rosca martelo). Faça sentada se sentir tontura.',
        imageUrl: 'exercises/rosca-biceps.svg'
      },
      {
        id: 'd3e5',
        name: 'Rosca Martelo com Garrafas',
        muscleGroup: 'Bíceps / Antebraço',
        sets: 2,
        reps: 12,
        isometric: false,
        equipment: '2 garrafas (500ml ou 1L)',
        startPosition: 'Em pé ou sentada, braços ao lado do corpo, segurando as garrafas com palmas viradas uma para a outra (como segurar um martelo).',
        execution: '1. Flexione os cotovelos, subindo as garrafas mantendo as palmas viradas para dentro.\n2. Suba até os ombros.\n3. Segure 1 segundo.\n4. Desça lentamente.',
        breathing: 'Expire ao subir. Inspire ao descer.',
        caution: '⚠️ Mesmas dicas da rosca normal. A pegada neutra (martelo) é mais gentil para os punhos. Ideal se tiver desconforto articular nas mãos.',
        imageUrl: 'exercises/rosca-martelo.svg'
      }
    ]
  },
  4: { // Quinta - Core + Equilíbrio + Mobilidade
    dayName: 'Core + Equilíbrio + Mobilidade',
    dayLabel: 'Quinta-feira',
    icon: '🧘',
    exercises: [
      {
        id: 'd4e1',
        name: 'Prancha Modificada (Joelhos)',
        muscleGroup: 'Core',
        sets: 3,
        reps: '20-30s',
        isometric: true,
        duration: 25,
        equipment: 'Tapete ou colchonete',
        startPosition: 'De bruços no chão, apoie-se nos antebraços e nos joelhos. Cotovelos sob os ombros. Corpo reto dos joelhos à cabeça.',
        execution: '1. Contraia o abdômen como se fosse levar o umbigo às costas.\n2. Mantenha a posição estável, sem deixar o quadril subir ou descer.\n3. Olhe para o chão para manter o pescoço neutro.\n4. Segure pelo tempo indicado.',
        breathing: 'Respire normalmente — não prenda a respiração. Inspire pelo nariz, expire pela boca de forma suave.',
        caution: '⚠️ Coloque uma toalha dobrada sob os joelhos para amortecer (especialmente o direito). Se a cervical doer, apoie a testa nas mãos entrelaçadas. Pare se sentir dor aguda.',
        imageUrl: 'exercises/prancha-joelhos.svg'
      },
      {
        id: 'd4e2',
        name: 'Bird-Dog (Cachorro-Pássaro)',
        muscleGroup: 'Core / Equilíbrio',
        sets: 3,
        reps: 8,
        isometric: false,
        equipment: 'Tapete ou colchonete',
        startPosition: 'Posição de quatro apoios: mãos sob os ombros, joelhos sob o quadril. Costas retas.',
        execution: '1. Estenda o braço direito para frente e a perna esquerda para trás ao mesmo tempo.\n2. Mantenha o corpo estável — sem girar o quadril.\n3. Segure 3 segundos.\n4. Volte devagar e troque (braço esquerdo + perna direita).\n5. Cada par = 1 repetição.',
        breathing: 'Expire ao estender. Inspire ao voltar.',
        caution: '⚠️ Almofade o joelho direito com toalha. Se for muito difícil manter o equilíbrio, comece fazendo só braço, depois só perna, antes de combinar.',
        imageUrl: 'exercises/bird-dog.svg'
      },
      {
        id: 'd4e3',
        name: 'Equilíbrio Unipodal',
        muscleGroup: 'Equilíbrio / Estabilidade',
        sets: 3,
        reps: '20s cada perna',
        isometric: true,
        duration: 20,
        equipment: 'Cadeira próxima (segurança)',
        startPosition: 'Em pé ao lado de uma cadeira (para se segurar se precisar). Pés juntos, postura ereta.',
        execution: '1. Transfira o peso para uma perna.\n2. Eleve o outro pé levemente do chão (5-10cm basta).\n3. Mantenha o equilíbrio pelo tempo indicado.\n4. Troque de perna.',
        breathing: 'Respire normalmente, de forma calma e rítmica.',
        caution: '⚠️ Sempre tenha uma cadeira ou parede ao alcance. Comece com a perna esquerda (mais forte). Ao apoiar no joelho direito, se doer, flexione menos. Use sapato se o pé escorregar.',
        imageUrl: 'exercises/equilibrio-unipodal.svg'
      },
      {
        id: 'd4e4',
        name: 'Respiração Diafragmática',
        muscleGroup: 'Core profundo / Relaxamento',
        sets: 3,
        reps: '10 respirações',
        isometric: true,
        duration: 60,
        equipment: 'Nenhum',
        startPosition: 'Deitada de costas ou sentada confortavelmente. Uma mão no peito, outra na barriga.',
        execution: '1. Inspire lentamente pelo nariz por 4 segundos, enchendo a barriga (a mão da barriga sobe, a do peito fica parada).\n2. Segure 2 segundos.\n3. Expire pela boca por 6 segundos, esvaziando a barriga.\n4. Repita 10 vezes por série.',
        breathing: 'Este exercício É de respiração. Inspire pelo nariz (4s), segure (2s), expire pela boca (6s).',
        caution: '⚠️ Se sentir tontura, volte a respirar normalmente. Não force a expiração. Este exercício ajuda a relaxar a musculatura cervical — aproveite!',
        imageUrl: 'exercises/respiracao-diafragmatica.svg'
      },
      {
        id: 'd4e5',
        name: 'Gato-Vaca (Cat-Cow)',
        muscleGroup: 'Mobilidade da coluna',
        sets: 2,
        reps: 10,
        isometric: false,
        equipment: 'Tapete ou colchonete',
        startPosition: 'Posição de quatro apoios: mãos sob os ombros, joelhos sob o quadril.',
        execution: '1. GATO: Arredonde as costas para cima, encolhendo o queixo em direção ao peito. Contraia o abdômen.\n2. Segure 3 segundos.\n3. VACA: Abaixe a barriga em direção ao chão, levantando a cabeça e o quadril. Abra o peito.\n4. Segure 3 segundos.\n5. Alterne suavemente entre as duas posições.',
        breathing: 'Inspire na posição de Vaca (barriga para baixo). Expire na posição de Gato (costas arredondadas).',
        caution: '⚠️ Movimento LENTO e SUAVE — especialmente na posição de Vaca, não force a cervical para trás. Olhe para o chão ao invés de olhar para cima. Almofade o joelho direito.',
        imageUrl: 'exercises/gato-vaca.svg'
      }
    ]
  },
  5: { // Sexta - Ombros + Braços
    dayName: 'Ombros + Braços',
    dayLabel: 'Sexta-feira',
    icon: '🏅',
    exercises: [
      {
        id: 'd5e1',
        name: 'Elevação Lateral com Garrafas',
        muscleGroup: 'Ombros',
        sets: 3,
        reps: 12,
        isometric: false,
        equipment: '2 garrafas (500ml)',
        startPosition: 'Em pé ou sentada, braços ao lado do corpo segurando as garrafas, palmas viradas para o corpo.',
        execution: '1. Eleve os braços para os lados até a altura dos ombros (formando um "T").\n2. Mantenha uma leve flexão nos cotovelos.\n3. Segure 1 segundo no topo.\n4. Desça lentamente.',
        breathing: 'Expire ao elevar. Inspire ao descer.',
        caution: '⚠️ Não eleve acima dos ombros para proteger a articulação. Use garrafas LEVES (500ml). Se o pescoço tensionar, faça sentada e use garrafas menores.',
        imageUrl: 'exercises/elevacao-lateral.svg'
      },
      {
        id: 'd5e2',
        name: 'Elevação Frontal Alternada',
        muscleGroup: 'Ombros (frontal)',
        sets: 2,
        reps: 10,
        isometric: false,
        equipment: '2 garrafas (500ml)',
        startPosition: 'Em pé ou sentada, braços à frente das coxas segurando as garrafas, palmas viradas para as coxas.',
        execution: '1. Eleve um braço à frente até a altura dos ombros, mantendo o braço quase esticado.\n2. Segure 1 segundo.\n3. Desça lentamente.\n4. Repita com o outro braço.\n5. Cada braço = 1 rep.',
        breathing: 'Expire ao elevar. Inspire ao descer.',
        caution: '⚠️ Não balance o corpo. Mantenha o abdômen contraído. Se o ombro estalar ou doer, reduza a amplitude (suba menos).',
        imageUrl: 'exercises/elevacao-frontal.svg'
      },
      {
        id: 'd5e3',
        name: 'Encolhimento de Ombros com Garrafas',
        muscleGroup: 'Trapézio',
        sets: 3,
        reps: 15,
        isometric: false,
        equipment: '2 garrafas (1L)',
        startPosition: 'Em pé, braços ao lado do corpo segurando as garrafas. Postura ereta, ombros relaxados.',
        execution: '1. Eleve os ombros em direção às orelhas (como se dissesse "não sei").\n2. Segure no topo por 2 segundos, apertando.\n3. Desça lentamente, relaxando completamente.\n4. Repita.',
        breathing: 'Expire ao encolher. Inspire ao relaxar.',
        caution: '⚠️ Este exercício pode aliviar OU agravar a cervical. Comece com garrafas leves. Se sentir aumento de dor no pescoço, PARE e substitua por rotações suaves de ombro (sem peso).',
        imageUrl: 'exercises/encolhimento-ombros.svg'
      },
      {
        id: 'd5e4',
        name: 'Rosca Concentrada',
        muscleGroup: 'Bíceps',
        sets: 2,
        reps: 12,
        isometric: false,
        equipment: '1 garrafa (1L)',
        startPosition: 'Sentada numa cadeira, pernas afastadas. Apoie o cotovelo do braço que vai trabalhar na parte interna da coxa. Segure a garrafa com a palma virada para cima.',
        execution: '1. Flexione o cotovelo, subindo a garrafa em direção ao ombro.\n2. Suba o máximo que conseguir, apertando o bíceps.\n3. Segure 1 segundo.\n4. Desça lentamente até o braço ficar quase esticado.\n5. Faça todas as reps e troque de braço.',
        breathing: 'Expire ao subir. Inspire ao descer.',
        caution: '⚠️ Apoie bem o cotovelo na coxa para estabilizar. Se inclinar muito o tronco, pode forçar a cervical — mantenha a postura ereta.',
        imageUrl: 'exercises/rosca-concentrada.svg'
      },
      {
        id: 'd5e5',
        name: 'Tríceps Coice com Garrafa',
        muscleGroup: 'Tríceps',
        sets: 2,
        reps: 12,
        isometric: false,
        equipment: '1 garrafa (500ml ou 1L)',
        startPosition: 'Em pé, incline o tronco para frente (~45°), apoiando uma mão na cadeira. Outra mão segura a garrafa, cotovelo dobrado a 90° rente ao corpo.',
        execution: '1. Estenda o braço para trás, esticando o cotovelo.\n2. Aperte o tríceps no final do movimento.\n3. Segure 1 segundo.\n4. Flexione o cotovelo devagar, voltando a 90°.\n5. Faça todas as reps e troque.',
        breathing: 'Expire ao estender. Inspire ao flexionar.',
        caution: '⚠️ Mantenha o cotovelo colado ao corpo. Não jogue o braço — movimento controlado. Se a posição inclinada incomodar a cervical, olhe para o chão e mantenha o pescoço neutro.',
        imageUrl: 'exercises/triceps-coice.svg'
      }
    ]
  },
  6: { // Sábado - Pernas Completo (adaptado joelho)
    dayName: 'Pernas Completo (Adaptado)',
    dayLabel: 'Sábado',
    icon: '🦵',
    exercises: [
      {
        id: 'd6e1',
        name: 'Agachamento na Cadeira',
        muscleGroup: 'Quadríceps / Glúteos',
        sets: 3,
        reps: 12,
        isometric: false,
        equipment: 'Cadeira firme',
        startPosition: 'Em pé, de costas para uma cadeira, pés na largura dos ombros. Braços esticados à frente para equilíbrio.',
        execution: '1. Flexione os joelhos e quadril como se fosse sentar na cadeira.\n2. Desça lentamente até tocar levemente a cadeira (sem desabar).\n3. Assim que tocar, empurre o chão e suba.\n4. Mantenha os joelhos alinhados com os pés (não deixe entrar para dentro).',
        breathing: 'Inspire ao descer. Expire ao subir.',
        caution: '⚠️ Fundamental para o joelho direito: não deixe o joelho passar da ponta do pé. Se doer, não desça até a cadeira — faça meio agachamento. Coloque um travesseiro na cadeira para encurtar o movimento se necessário.',
        imageUrl: 'exercises/agachamento-cadeira.svg'
      },
      {
        id: 'd6e2',
        name: 'Avanço Estático (Lunge)',
        muscleGroup: 'Quadríceps / Glúteos',
        sets: 2,
        reps: 10,
        isometric: false,
        equipment: 'Cadeira próxima (apoio)',
        startPosition: 'Em pé, dê um passo à frente com uma perna. Pé de trás apoiado na ponta. Segure na cadeira para equilíbrio se precisar.',
        execution: '1. Flexione ambos os joelhos, descendo o corpo.\n2. O joelho de trás desce em direção ao chão (não precisa encostar).\n3. O joelho da frente não deve passar da ponta do pé.\n4. Suba empurrando com a perna da frente.\n5. Faça todas as reps e troque.',
        breathing: 'Inspire ao descer. Expire ao subir.',
        caution: '⚠️ Quando a perna direita estiver na frente, desça MENOS. Se o joelho direito protestar, substitua por elevação de quadril. Segure na cadeira para equilíbrio.',
        imageUrl: 'exercises/avanco-estatico.svg'
      },
      {
        id: 'd6e3',
        name: 'Extensão de Joelho Sentada',
        muscleGroup: 'Quadríceps',
        sets: 3,
        reps: 12,
        isometric: false,
        equipment: 'Cadeira',
        startPosition: 'Sentada numa cadeira, costas apoiadas, pés no chão. Mãos segurando a borda da cadeira.',
        execution: '1. Estenda uma perna à frente até ficar reta (paralela ao chão).\n2. Segure 2 segundos no topo, contraindo o quadríceps.\n3. Desça lentamente até o pé quase tocar o chão.\n4. Repita e troque de perna.',
        breathing: 'Expire ao estender. Inspire ao descer.',
        caution: '⚠️ Exercício EXCELENTE para fortalecer o joelho. Na perna direita, faça com menos amplitude se necessário. Fortalecer o quadríceps ajuda a proteger a articulação do joelho com artrite.',
        imageUrl: 'exercises/extensao-joelho.svg'
      },
      {
        id: 'd6e4',
        name: 'Panturrilha em Pé',
        muscleGroup: 'Panturrilha',
        sets: 3,
        reps: 20,
        isometric: false,
        equipment: 'Parede ou cadeira (apoio)',
        startPosition: 'Em pé, segurando na parede ou cadeira. Pés na largura do quadril.',
        execution: '1. Fique na ponta dos pés, elevando os calcanhares o máximo possível.\n2. Segure 2 segundos no topo.\n3. Desça lentamente até os calcanhares quase tocarem o chão.\n4. Repita sem apoiar totalmente.',
        breathing: 'Expire ao subir. Inspire ao descer.',
        caution: '⚠️ Segure firme no apoio. Este exercício NÃO afeta o joelho — pode fazer sem restrição. Ótimo para circulação e equilíbrio.',
        imageUrl: 'exercises/panturrilha-pe.svg'
      },
      {
        id: 'd6e5',
        name: 'Cadeirinha na Parede (Isométrico)',
        muscleGroup: 'Quadríceps / Glúteos',
        sets: 3,
        reps: '20-30s',
        isometric: true,
        duration: 25,
        equipment: 'Parede lisa',
        startPosition: 'Encoste as costas na parede. Deslize para baixo até as coxas ficarem quase paralelas ao chão (ou até onde for confortável). Pés afastados na largura do quadril.',
        execution: '1. Mantenha a posição, costas coladas na parede.\n2. Joelhos a 90° (ou menos, se o joelho direito doer).\n3. Segure pelo tempo indicado.\n4. Para sair, deslize para cima lentamente.',
        breathing: 'Respire normalmente. Não prenda a respiração!',
        caution: '⚠️ Não desça tanto — para o joelho direito, mantenha o ângulo dos joelhos ACIMA de 90° (mais aberto). Se doer, fique mais "em pé" contra a parede. A parede ajuda a proteger os joelhos pois tira peso da articulação.',
        imageUrl: 'exercises/cadeirinha-parede.svg'
      }
    ]
  }
};

// Mapeamento dia da semana → dia do treino
// 1=Seg, 2=Ter, 3=Qua, 4=Qui, 5=Sex, 6=Sáb, 0=Dom(descanso)
const DAY_MAP = {
  1: 1, // Segunda → Dia 1
  2: 2, // Terça → Dia 2
  3: 3, // Quarta → Dia 3
  4: 4, // Quinta → Dia 4
  5: 5, // Sexta → Dia 5
  6: 6, // Sábado → Dia 6
  0: 0  // Domingo → Descanso
};

// Frases motivacionais (30+)
const MOTIVATIONAL_QUOTES = [
  { text: 'Cada movimento conta. Você está ficando mais forte a cada dia!', author: 'Seu corpo agradece' },
  { text: 'O exercício é a melhor medicina que existe.', author: 'Hipócrates' },
  { text: 'Não é sobre ser perfeita, é sobre ser consistente.', author: 'Para Simone' },
  { text: 'Seu corpo pode fazer coisas incríveis. Confie nele.', author: 'Motivação diária' },
  { text: 'A dor de hoje é a força de amanhã.', author: 'Sabedoria fitness' },
  { text: 'Você não precisa ser rápida. Precisa ser constante.', author: 'Lembrete' },
  { text: 'Cada treino te deixa mais independente e confiante.', author: 'Verdade' },
  { text: 'Mexer o corpo é um ato de amor próprio.', author: 'Cuidado pessoal' },
  { text: 'Comece onde você está. Use o que tem. Faça o que pode.', author: 'Arthur Ashe' },
  { text: 'O único treino ruim é o que não foi feito.', author: 'Sabedoria popular' },
  { text: 'Quem se movimenta, vive melhor e mais feliz.', author: 'Ciência' },
  { text: 'Seus ossos e articulações agradecem cada exercício.', author: 'Seu corpo' },
  { text: 'Força não vem do corpo. Vem da vontade.', author: 'Mahatma Gandhi' },
  { text: 'Um passo de cada vez. Um exercício de cada vez.', author: 'Paciência' },
  { text: 'Você é mais forte do que imagina, Simone!', author: '💪' },
  { text: 'A saúde é construída diariamente, não de uma vez.', author: 'Sabedoria' },
  { text: 'Hoje é um ótimo dia para cuidar de você.', author: 'Autocuidado' },
  { text: 'Mover-se é celebrar o que seu corpo pode fazer.', author: 'Gratidão' },
  { text: 'Quando sentir vontade de desistir, lembre-se do porquê começou.', author: 'Motivação' },
  { text: 'Sua determinação inspira!', author: 'Admiração' },
  { text: 'O corpo foi feito para se mover. Honre o seu.', author: 'Sabedoria' },
  { text: 'Disciplina é escolher entre o que você quer agora e o que você quer mais.', author: 'Abraham Lincoln' },
  { text: 'Cada série completada é uma vitória.', author: 'Celebre!' },
  { text: 'Você está investindo na sua saúde para os próximos 30 anos.', author: 'Futuro' },
  { text: 'Respire fundo. Você consegue.', author: 'Calma e força' },
  { text: 'O exercício é um presente que você dá para o seu eu do futuro.', author: 'Presente' },
  { text: 'Não compare sua jornada com a de ninguém. Essa é SUA história.', author: 'Individualidade' },
  { text: 'A consistência vence o talento quando o talento não é consistente.', author: 'Tim Notke' },
  { text: 'Mente sã, corpo são. Você está cuidando dos dois!', author: 'Equilíbrio' },
  { text: 'Orgulhe-se de cada treino. Você está fazendo a diferença.', author: 'Orgulho' },
  { text: 'Lembre-se: até os atletas começaram do zero.', author: 'Perspectiva' },
  { text: 'Seu sorriso depois do treino vale mais que qualquer troféu.', author: '😊' }
];
