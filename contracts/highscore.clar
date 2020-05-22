(define-map scores ((player principal)) ((score int)))

(define-data-var bestPlayer principal 'SP30MF7YC9QANV45Q7JWTRZY6KPCZGN2JF3X9FVM3)

(define-private (score-of (player principal))
  (default-to 0 (get score (map-get? scores ((player player)))))
)

(define-private (update-score-for (player principal) (newScore int)) 
  (begin 
    (var-set bestPlayer 
      (if
        (> newScore (score-of (var-get bestPlayer)))
        player
        (var-get bestPlayer)
      )
    )
    (map-set scores ((player player)) ((score newScore)))

    (get-score-of player)
  )
)

(define-public (get-best-player)
  (ok (var-get bestPlayer))
)

(define-public (get-score-of (player principal))
  (ok (score-of player))
)

(define-public (get-best-score) 
   (get-score-of (var-get bestPlayer))
)

(define-public (submit-score (newScore int))
  (ok 
    (if 
      (> newScore (score-of tx-sender))
      (update-score-for tx-sender newScore)
      (get-score-of tx-sender)
    )
  )
)